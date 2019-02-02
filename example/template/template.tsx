// tslint:disable-next-line:no-reference
/// <reference path="../../typings/@custom-site/index.d.ts" />
import { PostProps } from "@custom-site/page";
import * as React from "react";

const mainContent = (_props: PostProps, content?: React.ReactNode): React.ReactElement<any> => {
  return (
    <div className="wrapper">
      <section>
        <main className="page-content">{content}</main>
      </section>
    </div>
  );
};

const wrappedContent = (props: PostProps, content?: React.ReactNode): React.ReactElement<any> => {
  console.log(props);
  return (
    <body>
      <header className="site-header">
        <h1 className="site-title">{props.site.title}</h1>
      </header>
      {mainContent(props, content)}
    </body>
  );
};

export const createBodyTemplateFunction = (props: PostProps) => (content?: React.ReactNode): React.ReactElement<any> => {
  return wrappedContent(props, content);
};
