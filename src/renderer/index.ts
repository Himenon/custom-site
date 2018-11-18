import { Options } from "@rocu/cli";
import { PageElement, RenderedStaticPage, Source } from "@rocu/page";

const renderPage = (page: PageElement): RenderedStaticPage => {
  return {
    name: page.name,
    html: "<body>Hello</body>",
  };
};

const render = async ({ dirname, pages = [] }: Source, opts: Options): Promise<RenderedStaticPage[]> => {
  return pages.map(renderPage);
};

export { render };
