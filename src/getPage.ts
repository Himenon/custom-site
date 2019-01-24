import * as fs from "fs";
import * as matter from "gray-matter";
import * as path from "path";

import { CommonOption, DevelopOption } from "@custom-site/config";
import { HtmlMetaData, LinkHTMLAttributes, PageState, ScriptHTMLAttributes, Source } from "@custom-site/page";
import * as recursive from "recursive-readdir";
import { getDefaultConfig } from "./helpers";
import { appStore } from "./store";

export const isStartWithHttp = (url: string): boolean => url.match(/^https?\:\/\/|^\/\//) !== null;

const rewriteScriptSource = (attribute: string | ScriptHTMLAttributes, basePath: string): string | ScriptHTMLAttributes => {
  if (typeof attribute === "string") {
    return isStartWithHttp(attribute) ? attribute : path.join(basePath, attribute);
  }
  const src = attribute.src ? (isStartWithHttp(attribute.src) ? attribute.src : path.join(basePath, attribute.src)) : undefined;
  return { ...attribute, src };
};

const rewriteLinkSource = (attribute: string | LinkHTMLAttributes, basePath: string): string | LinkHTMLAttributes => {
  if (typeof attribute === "string") {
    return isStartWithHttp(attribute) ? attribute : path.join(basePath, attribute);
  }
  const href = attribute.href ? (isStartWithHttp(attribute.href) ? attribute.href : path.join(basePath, attribute.href)) : undefined;
  return { ...attribute, href };
};

const rewriteMetaData = (globalSetting: HtmlMetaData, localSetting: HtmlMetaData, uri: string, option: CommonOption): HtmlMetaData => {
  const globalLinks = [...(globalSetting.link ? globalSetting.link : []), ...(globalSetting.css ? globalSetting.css : [])];
  const localLinks = [...(localSetting.link ? localSetting.link : []), ...(localSetting.css ? localSetting.css : [])];
  const rewriteLocalScripts = localSetting.js ? localSetting.js.map(src => rewriteScriptSource(src, uri)) : localSetting.js;
  const rewriteLocalLinks = localLinks.map(attribute => rewriteLinkSource(attribute, uri));
  return {
    ...globalSetting,
    ...localSetting,
    globalScripts: globalSetting.js ? globalSetting.js.map(js => rewriteScriptSource(js, option.basePath)) : globalSetting.js,
    localScripts: rewriteLocalScripts,
    globalLinks: globalLinks.map(attribute => rewriteLinkSource(attribute, option.basePath)),
    localLinks: rewriteLocalLinks,
  };
};

const rewriteUri = (uri: string, option: CommonOption): string => {
  return path.join(option.basePath, uri).replace(/\/index$/, "");
};

const getPage = (dirname: string, option: CommonOption) => async (filename: string): Promise<PageState> => {
  const config = appStore.getState({ type: "config", id: "" }, option);
  // TODO cache
  const globalSetting = config && config.configFile && getDefaultConfig(config.configFile);
  const ext = path.extname(filename);
  const relativePath = path.relative(dirname, filename);
  const uri = relativePath.slice(0, relativePath.length - ext.length);
  const rewrittenUri = rewriteUri(uri, config);
  const raw = fs.readFileSync(filename, "utf8");
  const { data, content } = matter(raw);

  const metaData = rewriteMetaData(globalSetting ? globalSetting.global || {} : {}, data, path.dirname(rewrittenUri), config);
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

export const getData = async (options: DevelopOption): Promise<Source> => {
  const dirname = options.source;
  const allFiles = await recursive(dirname);
  const filenames = allFiles.filter(name => !/^\./.test(name));
  const jsxFilenames = filenames.filter(name => /\.jsx$/.test(name));
  const mdFilenames = filenames.filter(name => /\.mdx?/.test(name));

  const contentFiles = [...jsxFilenames, ...mdFilenames];
  const promises = contentFiles.map(getPage(dirname, options));
  const pages = await Promise.all(promises);
  return {
    dirname,
    pages,
  };
};
