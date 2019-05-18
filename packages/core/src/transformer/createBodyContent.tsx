import * as objectRestSpread from "@babel/plugin-proposal-object-rest-spread";
import * as transformJSX from "@babel/plugin-transform-react-jsx";
import * as babelStandAlone from "@babel/standalone";
import * as mdx from "@mdx-js/mdx";
import { CustomComponents, mdx as createElement, MDXProvider, MDXTagProps } from "@mdx-js/react";
import * as React from "react";

const convertWithBabel = (raw: string): string | null =>
  babelStandAlone.transform(raw, {
    plugins: [transformJSX, objectRestSpread],
  }).code;

export const applyMarkdownTextToMdxTag = (markdownText: string): string => {
  return mdx
    .sync(markdownText, {
      skipExport: true,
    })
    .trim();
};

export interface TransformConfig<T extends keyof CustomComponents> {
  customComponents: MDXTagProps<T>["components"];
  props: MDXTagProps<T>["props"];
}

export const transformRawStringToHtml = <T extends keyof JSX.IntrinsicElements>(config: TransformConfig<T>) => (
  content: string,
): React.ReactElement<any> => {
  const raw = applyMarkdownTextToMdxTag(content);
  const code = convertWithBabel(raw);
  const fullScope = {
    mdx: createElement,
    MDXProvider,
    ...config.customComponents, // TODO これ良い？
    components: config.customComponents,
    props: config.props,
  };
  const keys = Object.keys(fullScope);
  const values = keys.map(key => fullScope[key]);
  console.log(code);
  const mainLogic = `${code} return React.createElement(MDXProvider, { components },
    React.createElement(MDXContent, props)
  );`;
  // tslint:disable-next-line:function-constructor
  // const fn = new Function("React", ...keys, mainLogic);
  // tslint:disable-next-line:function-constructor
  const fn = new Function("_fn", "React", ...keys, mainLogic);
  const resultComponent = fn({}, React, ...values);
  return resultComponent;
};
