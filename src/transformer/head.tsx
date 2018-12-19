import { PageElement } from "@rocu/page";
import * as React from "react";

export const createHeadContent = (htmlMetaData: PageElement["data"]): React.ReactElement<any> => {
  return (
    <head lang="en">
      <title>{htmlMetaData.title}</title>
      <meta key="charset" {...{ charset: "utf-8" }} />
      {htmlMetaData.description && <meta name="description" content={htmlMetaData.description} />}
    </head>
  );
};
