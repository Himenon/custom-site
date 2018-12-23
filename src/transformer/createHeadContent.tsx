import { HtmlMetaData } from "@rocu/page";
import * as React from "react";

const generateViewportMetaTag = (viewport: HtmlMetaData["viewport"]): JSX.Element | undefined => {
  if (!viewport) {
    return;
  }
  const content = Object.keys(viewport)
    .map(key => `${key}=${viewport[key]}`)
    .join(",");
  return <meta name="viewport" content={content} />;
};

export const createHeadContent = (htmlMetaData: HtmlMetaData): React.ReactElement<any> => {
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
      {generateViewportMetaTag(htmlMetaData.viewport)}
    </head>
  );
};
