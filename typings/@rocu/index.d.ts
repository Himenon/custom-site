declare module "@rocu/development" {
  export interface FileWatchFlag {
    filename: string;
  }
}

declare module "@rocu/cli" {
  import { FileWatchFlag } from "@rocu/development";
  export interface CommonOption {
    source: string;
    destination?: string;
    serverBasePath: string | undefined;
    blacklist: {
      extensions: string[];
    };
  }
  /**
   * optional飲みの追加を認める
   */
  export interface DevelopOption extends CommonOption {
    watcher?: FileWatchFlag;
    open?: boolean;
  }
  /**
   * optional飲みの追加を認める
   */
  export interface BuildOption extends CommonOption {}
  export interface Options {
    develop?: DevelopOption;
    build?: BuildOption;
  }
}

declare module "@rocu/component" {
  export type ElementNames = keyof JSX.IntrinsicElements;
  export type Component = {};
  export type Option = {};
}

declare module "@rocu/page" {
  export interface TwitterMeta {
    "twitter:card"?: "summary" | "summary_large_image";
    "twitter:site"?: string;
  }

  export interface OGP {
    "og:title"?: string;
    "og:description"?: string;
    "og:url"?: string;
    "og:image"?: string;
  }

  export type ScriptHTMLAttributes = React.ScriptHTMLAttributes<HTMLScriptElement>;

  export type LinkHTMLAttributes = React.LinkHTMLAttributes<HTMLLinkElement>;

  export interface ExternalJavaScript {
    js?: Array<string | ScriptHTMLAttributes>;
    localScripts?: Array<string | ScriptHTMLAttributes>;
    globalScripts?: Array<string | ScriptHTMLAttributes>;
  }

  export interface ExternalCSS {
    css?: Array<string | LinkHTMLAttributes>;
  }

  export interface ExternalLink {
    link?: Array<string | LinkHTMLAttributes>;
    localLinks?: Array<string | LinkHTMLAttributes>;
    globalLinks?: Array<string | LinkHTMLAttributes>;
  }

  export interface HtmlMetaProperties extends OGP, TwitterMeta, ExternalJavaScript, ExternalCSS, ExternalLink {
    lang?: string;
    description?: string;
    keywords?: string;
    title?: string;
    stylesheets?: string[];
    layout?: string;
    copyright?: string;
    author?: string;
    viewport?: {
      "initial-scale"?: number | string;
      "maximum-scale"?: number | string;
      "minimum-scale"?: number | string;
      "user-scalable"?: "no";
      width?: number | "device-width";
    };
  }

  export interface PageElement {
    content: string;
    metaData: HtmlMetaProperties;
    ext: string;
    filename: string;
    name: string;
    raw: string;
    layoutJSX?: string;
  }

  export interface RenderedStaticPage {
    name: PageElement["name"];
    html: string;
  }

  export interface Source {
    dirname: string;
    pages: PageElement[];
  }
}
