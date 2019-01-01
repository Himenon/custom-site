import { CommonOption } from "@rocu/cli";
import { PageElement, RenderedStaticPage, Source } from "@rocu/page";
import * as path from "path";
import { createTemplate } from "./createTemplate";
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
const renderPage = (option: CommonOption) => (page: PageElement): RenderedStaticPage => {
  const createBodyContent = transformRawStringToHtml({
    customComponents: getCustomComponents(page, option),
    props: {},
  });
  const template = createTemplate();
  const bodyContent = createBodyContent(page.content);
  const headContent = createHeadContent(page.metaData);
  return {
    name: path.join(option.serverBasePath, page.name),
    originalName: page.name,
    html: combine({
      head: headContent,
      body: template(bodyContent),
    }),
  };
};

const render = async ({ pages = [] }: Source, option: CommonOption): Promise<RenderedStaticPage[]> => {
  return pages.map(renderPage(option));
};

export { render };
