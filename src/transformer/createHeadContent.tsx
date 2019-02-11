import { HtmlMetaData, MetaHTMLAttributes } from "@custom-site/page";
import * as React from "react";
import { generateGoogleAnalyticsElement } from "./tags/generateGoogleAnalyticsElement";
import { generateLinkElements } from "./tags/generateLinkElements";
import { generateScriptElements } from "./tags/generateScriptElements";

export const generateViewportMetaAttributes = ({ viewport }: HtmlMetaData): MetaHTMLAttributes | undefined => {
  if (!viewport) {
    return;
  }
  const content = Object.keys(viewport)
    .map(key => `${key}=${viewport[key]}`)
    .join(",");
  return {
    name: "viewport",
    content,
  };
};

/**
 * Merge shortcut parameter and extendable parameter
 */
export const convertMetaHTMLAttributes = (htmlMetaData: HtmlMetaData): MetaHTMLAttributes[] => {
  const viewport = generateViewportMetaAttributes(htmlMetaData);
  return [
    {
      key: "charset",
      charSet: "utf-8",
    },
    ...(htmlMetaData.keywords
      ? [
          {
            name: "keywords",
            content: htmlMetaData.keywords,
          },
        ]
      : []),
    ...(htmlMetaData.description
      ? [
          {
            name: "description",
            content: htmlMetaData.description,
          },
        ]
      : []),
    ...(htmlMetaData.copyright
      ? [
          {
            name: "copyright",
            content: htmlMetaData.copyright,
          },
        ]
      : []),
    ...(htmlMetaData.author
      ? [
          {
            name: "author",
            content: htmlMetaData.author,
          },
        ]
      : []),
    ...(htmlMetaData.extend && htmlMetaData.extend.meta ? htmlMetaData.extend.meta : []),
    ...(viewport ? [viewport] : []),
  ];
};

export const generateMetaElements = (props: MetaHTMLAttributes[]): Array<React.ReactElement<any>> => {
  return props.map((prop, idx) => <meta {...prop} key={`meta-${idx}`} />);
};

export const createHeadContent = (htmlMetaData: HtmlMetaData): React.ReactElement<any> => {
  const thirdParty = htmlMetaData.thirdParty;
  const metaAttributes = convertMetaHTMLAttributes(htmlMetaData);
  return (
    <>
      <title>{htmlMetaData.title}</title>
      {generateMetaElements(metaAttributes)}
      {generateScriptElements(htmlMetaData)}
      {generateLinkElements(htmlMetaData)}
      {thirdParty && thirdParty.googleAnalytics && generateGoogleAnalyticsElement(thirdParty.googleAnalytics)}
    </>
  );
};
