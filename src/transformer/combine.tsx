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

export const combine = (viewProps: ViewProps): React.ReactElement<any> => {
  return (
    <html>
      <head lang={viewProps.csrProps.htmlMetaData.lang || "en"}>
        {viewProps.head}
        <script id="csr-props" data-csr-props={JSON.stringify(viewProps.csrProps)} />
      </head>
      <body>{viewProps.body}</body>
    </html>
  );
};
