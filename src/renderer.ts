import { Options } from "@rocu/cli";
import { PageElement, RenderedStaticPage, Source } from "@rocu/page";
import { combine } from "./transformer/combine";
import { transformRawStringToHtml } from "./transformer/converter";
import { createHeadContent } from "./transformer/head";

const renderPage = (page: PageElement): RenderedStaticPage => {
  const converter = transformRawStringToHtml({
    customComponents: {},
    props: {},
  });
  const bodyContent = converter(page.content);
  const headContent = createHeadContent(page.data);
  return {
    name: page.name,
    html: combine({
      head: headContent,
      body: bodyContent,
    }),
  };
};

const render = async ({ dirname, pages = [] }: Source, opts: Options): Promise<RenderedStaticPage[]> => {
  return pages.map(renderPage);
};

export { render };
