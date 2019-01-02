import * as React from "react";

const wrappedContent = (content?: React.ReactNode): React.ReactElement<any> => {
  return <div id="content">{content}</div>;
};

export const bodyTemplate = (props: any) => (content?: React.ReactNode): React.ReactElement<any> => {
  const newContent = wrappedContent(content);
  return <body id="custom-template">{newContent}</body>;
};
