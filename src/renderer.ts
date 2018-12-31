import { BuildOption, CommonOption } from "@rocu/cli";
import { PageElement, RenderedStaticPage, Source } from "@rocu/page";
import * as path from "path";
import { combine, createHeadContent, transformRawStringToHtml } from "./transformer";
import { generateAnchorElement } from "./transformer/tags/generateAnchorElement";

const getCustomComponents = (page: PageElement, option: CommonOption) => {
  return {
    a: generateAnchorElement(page, option),
  };
};

/**
 * `option.serverBasePath`が存在する場合は、nameにつけて返す
 */
const renderPage = (option: BuildOption) => (page: PageElement): RenderedStaticPage => {
  console.log(`uri: ${page.uri}`);
  const createBodyContent = transformRawStringToHtml({
    customComponents: getCustomComponents(page, option),
    props: {},
  });
  const bodyContent = createBodyContent(page.content);
  const headContent = createHeadContent(page.metaData);
  return {
    name: path.join(option.serverBasePath, page.name),
    html: combine({
      head: headContent,
      body: bodyContent,
    }),
  };
};

const render = async ({ pages = [] }: Source, option: BuildOption): Promise<RenderedStaticPage[]> => {
  return pages.map(renderPage(option));
};

export { render };
