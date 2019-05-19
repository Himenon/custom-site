import { PostProps } from "@custom-site/interfaces/lib/page";
import * as React from "react";
import urljoin = require("url-join");

const createIndexes = (props: PostProps): React.ReactElement<any> => {
  const elements = props.indexes.map((meta, idx) => {
    return (
      <li key={idx}>
        <a href={meta.uri}>{meta.title}</a>
      </li>
    );
  });
  return (
    <div className="site-indexes">
      <header className="site-index-header" />
      <ul>{elements}</ul>
    </div>
  );
};

const createTagElement = (tags: string[]): React.ReactElement<any> => {
  const items = tags.map((tag, idx) => (
    <li className="tag-item" key={tag + idx}>
      {tag}
    </li>
  ));
  return <ul className="tag-list">{items}</ul>;
};

const mainContent = (props: PostProps, content?: React.ReactNode): React.ReactElement<any> => {
  const tags = props.page.metaData.tags ? props.page.metaData.tags.split(",") : [];
  return (
    <div className="wrapper">
      <main className="page-content">
        <header className="post-header">
          <h1>{props.page.metaData.title}</h1>
          {createTagElement(tags)}
        </header>
        {content}
      </main>
    </div>
  );
};

const wrappedContent = (props: PostProps, content?: React.ReactNode): React.ReactElement<any> => {
  return (
    <body>
      {createIndexes(props)}
      <div className="site-wrapper">
        <header className="site-header">
          <h1 className="site-title">
            <a className="site-title-text" href={urljoin(props.site.baseUrl, props.site.baseUri)}>
              {props.site.title}
            </a>
          </h1>
        </header>
        {mainContent(props, content)}
      </div>
    </body>
  );
};

export const createBodyTemplateFunction = (props: PostProps) => (content?: React.ReactNode): React.ReactElement<any> => {
  return wrappedContent(props, content);
};
