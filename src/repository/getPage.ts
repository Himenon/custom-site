import * as fs from "fs";
import * as matter from "gray-matter";
import * as path from "path";

import { Options } from "@rocu/cli";
import { HtmlMetaProperties, PageElement, Source } from "@rocu/page";
import * as recursive from "recursive-readdir";

/**
 * TODO load parameters from local setting file.
 */
const defaultMetaData: HtmlMetaProperties = {
  lang: "en",
};

const loadJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));

const getDefaultSetting = (dirname: string, opts: Options, filename: string = "rocu.json"): HtmlMetaProperties => {
  let globalSetting: undefined | HtmlMetaProperties;
  const filePath = path.join(dirname, filename);
  // clear cache
  if (opts.watcher && opts.watcher.filename === filePath) {
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

const rewriteMetaData = (globalSetting: HtmlMetaProperties, localSetting: HtmlMetaProperties): HtmlMetaProperties => ({
  ...globalSetting,
  ...localSetting,
  globalScripts: globalSetting.scripts,
  localScripts: localSetting.scripts,
});

const getPage = (dirname: string, opts: Options) => async (filename: string): Promise<PageElement> => {
  const globalSetting = getDefaultSetting(dirname, opts);
  const ext = path.extname(filename);
  const relativePath = path.relative(dirname, filename);
  const name = relativePath.slice(0, relativePath.length - ext.length);
  const raw = fs.readFileSync(filename, "utf8");
  const { data, content } = matter(raw);

  const metaData = rewriteMetaData(globalSetting, data);
  console.log(metaData);

  return {
    content,
    metaData,
    ext,
    filename,
    name,
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

export const getData = async (dirname: string, opts: Options): Promise<Source> => {
  const allFiles = await recursive(dirname);
  const filenames = allFiles.filter(name => !/^\./.test(name));
  const jsxFilenames = filenames.filter(name => /\.jsx$/.test(name));
  const mdFilenames = filenames.filter(name => /\.mdx?/.test(name));

  const contentFiles = [...jsxFilenames, ...mdFilenames];
  const promises = contentFiles.map(getPage(dirname, opts));
  const pages = await Promise.all(promises);
  const withLayouts = pages.map(getLayout(pages));
  return {
    dirname,
    pages: withLayouts,
  };
};
