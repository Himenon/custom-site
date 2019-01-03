// tslint:disable-next-line:no-reference
/// <reference path="../typings/@mdx-js/index.d.ts"/>

import { CustomComponents } from "@mdx-js/tag";
import * as React from "react";

export const customComponents = (): CustomComponents => {
  return {
    h1: props => {
      return (
        <div className="custom-component-title">
          <h2 {...props} />
        </div>
      );
    },
  };
};
