declare module "@custom-site/development" {
  export interface FileWatchFlag {
    filename: string;
  }
}

declare module "@custom-site/internal" {
  import { Page, OGP, HtmlMetaProperties } from "@custom-site/page";
  export interface State {
    GENERATE_META_DATA: { metaData: HtmlMetaProperties };
  }
}

declare module "@custom-site/cli" {
  import { FileWatchFlag } from "@custom-site/development";
  import { HtmlMetaProperties } from "@custom-site/page";
  export interface CommonOption {
    source: string;
    global: HtmlMetaProperties;
    destination?: string;
    basePath: string;
    port: number;
    blacklist: {
      extensions: string[];
    };
    layoutFile?: string;
    customComponentsFile?: string;
  }
  /**
   * optionalのみの追加を認める
   */
  export interface DevelopOption extends CommonOption {
    watcher?: FileWatchFlag;
    open?: boolean;
  }
  /**
   * optionalのみの追加を認める
   */
  export interface BuildOption extends CommonOption {
    destination: string;
  }
  export interface Options {
    develop?: DevelopOption;
    build?: BuildOption;
  }
}

declare module "@custom-site/page" {
  import { CustomComponents } from "@mdx-js/tag";

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

  export interface ThirdParty {
    googleAnalytics?: {
      ua?: string;
    };
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
    thirdParty?: ThirdParty;
  }

  export type createTemplateFunction = (props: Post) => (content?: React.ReactNode) => React.ReactElement<any>;

  export interface ExternalTemplate {
    bodyTemplateFunction: createTemplateFunction;
  }

  export interface ExternalCustomComponent {
    generateCustomComponents: () => CustomComponents;
  }

  export interface Template {
    pageProps: Post;
    createTemplateFunction?: createTemplateFunction;
  }

  export interface Site {
    title: string;
    description: string;
    url: {
      relativePath: string;
      absolutePath: string;
    };
  }

  export interface Article {
    title: string;
    description: string;
    url: {
      relativePath: string;
      absolutePath: string;
    };
  }

  export interface Post {
    site: Site;
    article: Article;
  }

  export interface Page {
    uri: string;
    content: string;
    metaData: HtmlMetaProperties;
    ext: string;
    filename: string;
    name: string;
    raw: string;
  }

  export interface RenderedStaticPage {
    name: Page["name"];
    originalName: string;
    html: string;
  }

  export interface Source {
    dirname: string;
    pages: Page[];
  }
}
