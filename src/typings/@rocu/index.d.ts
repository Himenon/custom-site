declare module "@rocu/cli" {
  export interface Options {
    outDir?: string;
  }
}

declare module "@rocu/page" {
  export interface HtmlMetaData {
    description?: string;
    title?: string;
    og?: { [key: string]: string };
    twitter?: { [key: string]: string };
    scripts?: string[];
    stylesheets?: string[];
    layout?: string;
  }

  export interface PageElement {
    content: string;
    data: HtmlMetaData;
    ext: string;
    filename: string;
    name: string;
    raw: string;
    layoutJSX?: string;
  }

  export interface RenderedPage extends PageElement {
    html: string;
  }

  export interface Source {
    dirname: string;
    pages: PageElement[];
  }
}
