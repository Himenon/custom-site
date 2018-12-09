import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

export interface ElementMap {
  head: React.ReactElement<any>;
  body: React.ReactElement<any>;
}

export const combine = (elements: ElementMap): string => {
  const page = (
    <html>
      {elements.head}
      {elements.body}
    </html>
  );

  return renderToStaticMarkup(page);
};
