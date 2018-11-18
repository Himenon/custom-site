import { Options } from "@rocu/cli";
import { PageElement, RenderedPage, Source } from "@rocu/page";

const renderPage = (page: PageElement): RenderedPage => {
  return {
    ...page,
    html: "<body>Hello</body>",
  };
};

const render = async ({ dirname, pages = [] }: Source, opts: Options): Promise<RenderedPage[]> => {
  console.log(dirname);
  console.log(pages);
  return pages.map(renderPage);
};

export { render };
