declare module "@custom-site/development" {
  export interface FileWatchFlag {
    filename: string;
  }
}

declare module "@custom-site/plugin" {
  export type PluginName = string;
  import { HtmlMetaData } from "@custom-site/page";

  export interface State {
    GENERATE_META_DATA: { metaData: HtmlMetaData };
  }

  export type CreateHandlerMap<T> = { [P in keyof T]?: Array<(payload: T[P]) => T[P]> };
  export type CreateHandler<K extends keyof EventHandlerMap> = (payload: State[K]) => State[K];
  export type EventHandlerMap = CreateHandlerMap<State>;

  export interface PluginFunctionMap {
    onGenerateMetaData?: CreateHandler<"GENERATE_META_DATA">;
  }

  export interface PluginDetail {
    name: PluginName;
    resolve?: string;
  }

  export type Plugin = PluginDetail | PluginName;
}

declare module "@custom-site/internal" {
  import { Plugin } from "@custom-site/plugin";
  import { CommonOption } from "@custom-site/config";
  export interface State {
    PLUGINS: Plugin[];
    config: CommonOption;
  }
}

declare module "@custom-site/config" {
  import { FileWatchFlag } from "@custom-site/development";
  import { HtmlMetaData } from "@custom-site/page";
  import { Plugin } from "@custom-site/plugin";
  export interface CommonOption {
    baseDir: string;
    source: string;
    global: HtmlMetaData;
    destination?: string;
    basePath: string;
    port: number;
    blacklist: {
      extensions: string[];
    };
    layoutFile?: string;
    customComponentsFile?: string;
    plugins: Plugin[];
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

  export interface HtmlMetaData extends OGP, TwitterMeta, ExternalJavaScript, ExternalCSS, ExternalLink {
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

  export type createTemplateFunction = (props: PostProps) => (content?: React.ReactNode) => React.ReactElement<any>;

  export interface ExternalTemplate {
    createBodyTemplateFunction: createTemplateFunction;
  }

  export interface ExternalCustomComponent {
    generateCustomComponents: () => CustomComponents;
  }

  export interface TemplateProps {
    postProps: PostProps;
    createTemplateFunction?: createTemplateFunction;
  }

  export interface SiteState {
    title: string;
    description: string;
    url: {
      relativePath: string;
      absolutePath: string;
    };
  }

  export interface ArticleProps {
    metaData: HtmlMetaData;
  }

  export interface PageState {
    uri: string;
    content: string;
    metaData: HtmlMetaData;
    ext: string;
    filename: string;
    name: string;
    raw: string;
  }

  export interface PostProps {
    site: SiteState;
    page: PageState;
  }

  export interface RenderedStaticPage {
    name: PageState["name"];
    originalName: string;
    html: string;
  }

  export interface Source {
    dirname: string;
    pages: PageState[];
  }
}
