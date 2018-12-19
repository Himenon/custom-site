import { Options } from "@rocu/cli";
import { PageElement, RenderedStaticPage, Source } from "@rocu/page";
import { combine } from "./transformer/combine";
import { transformRawStringToHtml } from "./transformer/converter";
import { createHeadContent } from "./transformer/head";

const renderPage = (page: PageElement): RenderedStaticPage => {
  const createBodyContent = transformRawStringToHtml({
    customComponents: {},
    props: {},
  });
  const bodyContent = createBodyContent(page.content);
  const headContent = createHeadContent(page.metaData);
  return {
    name: page.name,
    html: combine({
      head: headContent,
      body: bodyContent,
    }),
  };
};

const render = async ({ pages = [] }: Source, _opts: Options): Promise<RenderedStaticPage[]> => {
  return pages.map(renderPage);
};

export { render };
