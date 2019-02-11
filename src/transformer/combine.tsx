import { HtmlMetaData, PageState, SiteState } from "@custom-site/page";
import * as React from "react";

export interface ViewProps {
  csrProps: {
    htmlMetaData: HtmlMetaData;
    site: SiteState;
    page: PageState;
  };
  head: React.ReactElement<any>;
  body: React.ReactElement<any>;
}

const generateCsrInitialPropsScript = (csrProps: ViewProps["csrProps"]) => {
  const props: JSX.IntrinsicElements["script"] = {
    dangerouslySetInnerHTML: {
      __html: `window.__INITIAL_PROPS__ = ${JSON.stringify(csrProps)}`,
    },
  };
  return <script {...props} />;
};

export const combine = (viewProps: ViewProps): React.ReactElement<any> => {
  return (
    <html>
      <head lang={viewProps.csrProps.htmlMetaData.lang || "en"}>
        {viewProps.head}
        {generateCsrInitialPropsScript(viewProps.csrProps)}
      </head>
      <body>{viewProps.body}</body>
    </html>
  );
};
