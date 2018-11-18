import { Options } from "@rocu/cli";
import { PageElement, RenderedStaticPage, Source } from "@rocu/page";
import { renderToStaticMarkup } from "react-dom/server";
import { transformRawStringToHtml } from "../transformer";

const renderPage = (page: PageElement): RenderedStaticPage => {
  const converter = transformRawStringToHtml({
    customComponents: {},
    props: {},
  });
  return {
    name: page.name,
    html: renderToStaticMarkup(converter(page.raw)),
  };
};

const render = async ({ dirname, pages = [] }: Source, opts: Options): Promise<RenderedStaticPage[]> => {
  return pages.map(renderPage);
};

export { render };
