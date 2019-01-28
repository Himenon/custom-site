import { HtmlMetaData } from "@custom-site/page";
import * as React from "react";
import { generateGoogleAnalyticsElement } from "./tags/generateGoogleAnalyticsElement";
import { generateLinkElements } from "./tags/generateLinkElements";
import { generateScriptElements } from "./tags/generateScriptElements";

export const generateViewportMetaElements = ({ viewport }: HtmlMetaData): JSX.Element | undefined => {
  if (!viewport) {
    return;
  }
  const content = Object.keys(viewport)
    .map(key => `${key}=${viewport[key]}`)
    .join(",");
  return <meta name="viewport" content={content} />;
};

export const createHeadContent = (htmlMetaData: HtmlMetaData): React.ReactElement<any> => {
  const thirdParty = htmlMetaData.thirdParty;
  return (
    <head lang={htmlMetaData.lang || "en"}>
      <title>{htmlMetaData.title}</title>
      <meta key="charset" charSet="utf-8" />
      {htmlMetaData.keywords && <meta name="keywords" content={htmlMetaData.keywords} />}
      {htmlMetaData.description && <meta name="description" content={htmlMetaData.description} />}
      {htmlMetaData.copyright && <meta name="copyright" content={htmlMetaData.copyright} />}
      {htmlMetaData.author && <meta name="author" content={htmlMetaData.author} />}
      {htmlMetaData["og:title"] && <meta property="og:title" content={htmlMetaData["og:title"]} />}
      {htmlMetaData["og:description"] && <meta property="og:description" content={htmlMetaData["og:description"]} />}
      {htmlMetaData["og:image"] && <meta property="og:image" content={htmlMetaData["og:image"]} />}
      {htmlMetaData["og:url"] && <meta property="og:url" content={htmlMetaData["og:url"]} />}
      {htmlMetaData["twitter:site"] && <meta property="twitter:site" content={htmlMetaData["twitter:site"]} />}
      {htmlMetaData["twitter:card"] && <meta property="twitter:card" content={htmlMetaData["twitter:card"]} />}
      {generateViewportMetaElements(htmlMetaData)}
      {generateScriptElements(htmlMetaData)}
      {generateLinkElements(htmlMetaData)}
      {thirdParty && thirdParty.googleAnalytics && generateGoogleAnalyticsElement(thirdParty.googleAnalytics)}
    </head>
  );
};
