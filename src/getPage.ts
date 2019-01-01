import * as fs from "fs";
import * as matter from "gray-matter";
import * as path from "path";

import { CommonOption, DevelopOption } from "@rocu/cli";
import { HtmlMetaProperties, LinkHTMLAttributes, PageElement, ScriptHTMLAttributes, Source } from "@rocu/page";
import * as recursive from "recursive-readdir";

/**
 * TODO load parameters from local setting file.
 */
const defaultMetaData: HtmlMetaProperties = {
  lang: "en",
};

const loadJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));

const getDefaultSetting = (dirname: string, options: DevelopOption, filename: string = "rocu.json"): HtmlMetaProperties => {
  let globalSetting: undefined | HtmlMetaProperties;
  const filePath = path.join(dirname, filename);
  // clear cache
  if (options.watcher && options.watcher.filename === filePath) {
    globalSetting = undefined;
  }
  if (globalSetting) {
    return globalSetting;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return (globalSetting = loadJsonFile(filePath));
  }
  return defaultMetaData;
};

const rewriteScriptSource = (attribute: string | ScriptHTMLAttributes, basePath: string): string | ScriptHTMLAttributes => {
  if (typeof attribute === "string") {
    return path.join(basePath, attribute);
  }
  const src = attribute.src ? path.join(basePath, attribute.src) : undefined;
  return { ...attribute, src };
};

const rewriteLinkSource = (attribute: string | LinkHTMLAttributes, basePath: string): string | LinkHTMLAttributes => {
  if (typeof attribute === "string") {
    return path.join(basePath, attribute);
  }
  const href = attribute.href ? path.join(basePath, attribute.href) : undefined;
  return { ...attribute, href };
};

const rewriteMetaData = (
  globalSetting: HtmlMetaProperties,
  localSetting: HtmlMetaProperties,
  uri: string,
  option: CommonOption,
): HtmlMetaProperties => {
  const globalLinks = [...(globalSetting.link ? globalSetting.link : []), ...(globalSetting.css ? globalSetting.css : [])];
  const localLinks = [...(localSetting.link ? localSetting.link : []), ...(localSetting.css ? localSetting.css : [])];
  const rewriteLocalScripts = localSetting.js ? localSetting.js.map(src => rewriteScriptSource(src, uri)) : localSetting.js;
  const rewriteLocalLinks = localLinks.map(attribute => rewriteLinkSource(attribute, uri));
  console.log({
    uri,
    beforeLink: localLinks,
    afterLink: rewriteLocalLinks,
    beforeScript: localSetting.js,
    afterScript: rewriteLocalScripts,
  });
  console.log("----------");
  return {
    ...globalSetting,
    ...localSetting,
    globalScripts: globalSetting.js ? globalSetting.js.map(js => rewriteScriptSource(js, option.serverBasePath)) : globalSetting.js,
    localScripts: rewriteLocalScripts,
    globalLinks: globalLinks.map(attribute => rewriteLinkSource(attribute, option.serverBasePath)),
    localLinks: rewriteLocalLinks,
  };
};

const formatUri = (uri: string, option: CommonOption): string => {
  return path.join(option.serverBasePath, uri).replace(/\/index$/, "");
};

const getPage = (dirname: string, option: CommonOption) => async (filename: string): Promise<PageElement> => {
  const globalSetting = getDefaultSetting(dirname, option);
  const ext = path.extname(filename);
  const relativePath = path.relative(dirname, filename);
  const uri = relativePath.slice(0, relativePath.length - ext.length);
  const fUri = formatUri(uri, option);
  const raw = fs.readFileSync(filename, "utf8");
  const { data, content } = matter(raw);

  console.log(`fUri: ${fUri}`, `dirname: ${path.dirname(fUri)}`);
  const metaData = rewriteMetaData(globalSetting, data, path.dirname(fUri), option);
  return {
    uri: fUri,
    content,
    metaData,
    ext,
    filename,
    name: uri,
    raw,
  };
};

const getLayout = (pages: PageElement[]) => (page: PageElement): PageElement => {
  if (page.ext !== ".md ") {
    return page;
  }
  if (!page.metaData.layout) {
    return page;
  }
  const layout = pages.find((p: PageElement) => p.name === page.metaData.layout);
  if (!layout) {
    return page;
  }
  page.metaData = { ...layout.metaData, ...page.metaData };
  page.layoutJSX = layout.content;
  return page;
};

export const getData = async (dirname: string, options: DevelopOption): Promise<Source> => {
  const allFiles = await recursive(dirname);
  const filenames = allFiles.filter(name => !/^\./.test(name));
  const jsxFilenames = filenames.filter(name => /\.jsx$/.test(name));
  const mdFilenames = filenames.filter(name => /\.mdx?/.test(name));

  const contentFiles = [...jsxFilenames, ...mdFilenames];
  const promises = contentFiles.map(getPage(dirname, options));
  const pages = await Promise.all(promises);
  const withLayouts = pages.map(getLayout(pages));
  return {
    dirname,
    pages: withLayouts,
  };
};
