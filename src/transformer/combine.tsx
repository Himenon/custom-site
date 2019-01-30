import * as React from "react";

export interface ElementMap {
  head: React.ReactElement<any>;
  body: React.ReactElement<any>;
}

export const combine = (elements: ElementMap): React.ReactElement<any> => {
  return (
    <html>
      {elements.head}
      {elements.body}
    </html>
  );
};
