import * as fs from "fs";
import * as matter from "gray-matter";
import * as path from "path";

import { Options } from "@rocu/cli";
import { HtmlMetaData, PageElement, Source } from "@rocu/page";
import * as recursive from "recursive-readdir";

/**
 * TODO load parameters from local setting file.
 */
const defaultMetaData: HtmlMetaData = {
  lang: "en",
};

let localSetting: undefined | HtmlMetaData;

const loadJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));

const getDefaultSetting = (dirname: string, opts: Options, filename: string = "rocu.json"): HtmlMetaData => {
  const filePath = path.join(dirname, filename);
  // clear cache
  if (opts.watcher && opts.watcher.filename === filePath) {
    localSetting = undefined;
  }
  if (localSetting) {
    return localSetting;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return (localSetting = loadJsonFile(filePath));
  }
  return defaultMetaData;
};

const overrideDefaultMetaData = (defaultSetting: HtmlMetaData, data: HtmlMetaData): HtmlMetaData => ({
  ...defaultSetting,
  ...data,
});

const getPage = (dirname: string, opts: Options) => async (filename: string): Promise<PageElement> => {
  const defaultSetting = getDefaultSetting(dirname, opts);
  const ext = path.extname(filename);
  const relativePath = path.relative(dirname, filename);
  const name = relativePath.slice(0, relativePath.length - ext.length);
  const raw = fs.readFileSync(filename, "utf8");
  const { data, content } = matter(raw);

  const metaData = overrideDefaultMetaData(defaultSetting, data);

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
