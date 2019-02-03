import * as fs from "fs";
import * as matter from "gray-matter";
import * as path from "path";

import { CommonOption } from "@custom-site/config";
import { HtmlMetaData, LinkHTMLAttributes, PageState, ScriptHTMLAttributes } from "@custom-site/page";
import * as recursive from "recursive-readdir";
import { app } from "./store";

export const isStartWithHttp = (url: string): boolean => url.match(/^https?\:\/\/|^\/\//) !== null;

const rewriteNodeModulePathToLib = (link: string): string => {
  const config = app.get({ type: "config", id: "" }) || { __type: "DEVELOPMENT" };
  const isProduction = config.__type === "PRODUCTION";
  const startList = ["node_modules", "./node_modules", "../node_modules"];
  if (!isProduction || !startList.map(s => link.startsWith(s)).includes(true)) {
    return link;
  }
  return path.join("lib", path.basename(link));
};

const rewriteScriptSource = (attribute: string | ScriptHTMLAttributes, basePath: string): string | ScriptHTMLAttributes => {
  if (typeof attribute === "string") {
    return isStartWithHttp(attribute) ? attribute : path.join(basePath, attribute);
  }
  const src = attribute.src ? (isStartWithHttp(attribute.src) ? attribute.src : path.join(basePath, attribute.src)) : undefined;
  return { ...attribute, src };
};

const rewriteLinkSource = (attribute: string | LinkHTMLAttributes, basePath: string): string | LinkHTMLAttributes => {
  if (typeof attribute === "string") {
    return isStartWithHttp(attribute) ? attribute : path.join(basePath, rewriteNodeModulePathToLib(attribute));
  }
  const href = attribute.href
    ? isStartWithHttp(attribute.href)
      ? attribute.href
      : path.join(basePath, rewriteNodeModulePathToLib(attribute.href))
    : undefined;
  return { ...attribute, href };
};

const rewriteMetaData = (globalSetting: HtmlMetaData, localSetting: HtmlMetaData, uri: string, basePath: string): HtmlMetaData => {
  const globalLinks = [...(globalSetting.link ? globalSetting.link : []), ...(globalSetting.css ? globalSetting.css : [])];
  const localLinks = [...(localSetting.link ? localSetting.link : []), ...(localSetting.css ? localSetting.css : [])];
  const rewriteLocalScripts = localSetting.js ? localSetting.js.map(src => rewriteScriptSource(src, uri)) : localSetting.js;
  const rewriteLocalLinks = localLinks.map(attribute => rewriteLinkSource(attribute, uri));
  return {
    ...globalSetting,
    ...localSetting,
    globalScripts: globalSetting.js ? globalSetting.js.map(js => rewriteScriptSource(js, basePath)) : globalSetting.js,
    localScripts: rewriteLocalScripts,
    globalLinks: globalLinks.map(attribute => rewriteLinkSource(attribute, basePath)),
    localLinks: rewriteLocalLinks,
  };
};

const rewriteUri = (uri: string, basePath: string): string => {
  return path.join(basePath, uri).replace(/\/index$/, "");
};

const getPage = (config: { global: HtmlMetaData; source: string; baseUri: string }) => async (filename: string): Promise<PageState> => {
  const ext = path.extname(filename);
  const relativePath = path.relative(config.source, filename);
  const uri = relativePath.slice(0, relativePath.length - ext.length);
  const rewrittenUri = rewriteUri(uri, config.baseUri);
  const raw = fs.readFileSync(filename, "utf8");
  const { data, content } = matter(raw);

  const metaData = rewriteMetaData(config.global, data, path.dirname(rewrittenUri), config.baseUri);
  return {
    uri: rewrittenUri,
    content,
    metaData,
    ext,
    filename,
    name: uri,
    raw,
  };
};

export const getPages = async (config: CommonOption): Promise<PageState[]> => {
  const dirname = config.source;
  const allFiles = await recursive(dirname);
  const filenames = allFiles.filter(name => !/^\./.test(name));
  const jsxFilenames = filenames.filter(name => /\.jsx$/.test(name));
  const mdFilenames = filenames.filter(name => /\.mdx?/.test(name));
  const contentFiles = [...jsxFilenames, ...mdFilenames];
  const promises = contentFiles.map(getPage({ ...config }));
  const pages = await Promise.all(promises);
  return pages;
};
