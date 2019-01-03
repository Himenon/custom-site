// tslint:disable-next-line:no-reference
/// <reference path="../typings/@custom-site/index.d.ts"/>

import { PageProps } from "@custom-site/page";
import * as React from "react";

const wrappedContent = (content?: React.ReactNode): React.ReactElement<any> => {
  return <div id="content">{content}</div>;
};

export const bodyTemplate = (props: PageProps) => (content?: React.ReactNode): React.ReactElement<any> => {
  const newContent = wrappedContent(content);
  return (
    <body id="custom-template">
      <h1>{props.site.title}</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
      {newContent}
    </body>
  );
};
