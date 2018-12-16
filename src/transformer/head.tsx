import { PageElement } from "@rocu/page";
import * as React from "react";

export const createHeadContent = (htmlMetaData: PageElement["data"]): React.ReactElement<any> => {
  return (
    <head>
      <title>{htmlMetaData.title}</title>
      {htmlMetaData.description && <meta name="description" content={htmlMetaData.description} />}
    </head>
  );
};
