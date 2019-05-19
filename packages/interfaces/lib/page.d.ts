import { CustomComponents } from "@mdx-js/react";

// TODO Plugin
export interface TwitterMeta {
  "twitter:card"?: "summary" | "summary_large_image";
  "twitter:site"?: string;
}

// TODO Plugin
export interface OGP {
  "og:title"?: string;
  "og:description"?: string;
  "og:url"?: string;
  "og:image"?: string;
}

export type ScriptHTMLAttributes = JSX.IntrinsicElements["script"];

export type LinkHTMLAttributes = JSX.IntrinsicElements["link"];

export type MetaHTMLAttributes = JSX.IntrinsicElements["meta"];

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

export interface HtmlMetaData extends ExternalJavaScript, ExternalCSS, ExternalLink {
  /**
   * Default Support Meta Property Set
   */
  lang?: string;
  description?: string;
  keywords?: string;
  title?: string;
  tags?: string;
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
  /**
   * Extendable Meta Property Parameters
   */
  extend?: {
    meta?: MetaHTMLAttributes[];
    script?: ScriptHTMLAttributes[];
    link?: LinkHTMLAttributes[];
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
  baseUri: string;
  baseUrl: string;
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

export interface Index {
  uri: string;
  title: string;
  tags: string[];
}

export interface PostProps {
  site: SiteState;
  page: PageState;
  indexes: Index[];
}

export interface RenderedStaticPage {
  name: PageState["name"];
  originalName: string;
  html: string;
}
