import * as fs from "fs";
import * as matter from "gray-matter";
import * as path from "path";

import { Options } from "@rocu/cli";
import { PageElement, Source } from "@rocu/page";
import * as recursive from "recursive-readdir";

const getPage = (dirname: string) => async (filename: string): Promise<PageElement> => {
  const ext = path.extname(filename);
  const relativePath = path.relative(dirname, filename);
  const name = relativePath.slice(0, relativePath.length - ext.length);
  const raw = fs.readFileSync(filename, "utf8");
  const { data, content } = matter(raw);

  return {
    content,
    data,
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
  if (!page.data.layout) {
    return page;
  }
  const layout = pages.find((p: PageElement) => p.name === page.data.layout);
  if (!layout) {
    return page;
  }
  page.data = { ...layout.data, ...page.data };
  page.layoutJSX = layout.content;
  return page;
};

export const getData = async (dirname: string, _opts: Options): Promise<Source> => {
  const allFiles = await recursive(dirname);
  console.log(allFiles);
  const filenames = allFiles.filter(name => !/^\./.test(name));
  const jsxFilenames = filenames.filter(name => /\.jsx$/.test(name));
  const mdFilenames = filenames.filter(name => /\.mdx?/.test(name));

  const contentFiles = [...jsxFilenames, ...mdFilenames];
  const promises = contentFiles.map(getPage(dirname));
  const pages = await Promise.all(promises);
  const withLayouts = pages.map(getLayout(pages));
  return {
    dirname,
    pages: withLayouts,
  };
};
