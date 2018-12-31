import { CommonOption } from "@rocu/cli";
import { PageElement } from "@rocu/page";
import * as path from "path";
import * as React from "react";

/**
 * @param uri aタグのhref
 * @param page page.uriはoption.serverBasePathをすでに加算した状態で存在する
 * @param option 相対パスの算出では利用しない
 */
export const rewriteHyperReference = (uri: string, page: PageElement, option: CommonOption) => {
  if (uri.startsWith("./")) {
    const splitPath = page.uri.split("/");
    splitPath[splitPath.length - 1] = uri.slice(2);
    return path.join(...splitPath.map(p => (p === "" ? "/" : p))).replace(/\/$/, "");
  }
  if (uri.startsWith("../")) {
    return path.join(page.uri, uri).replace(/\/$/, "");
  }
  return path.join(option.serverBasePath, uri);
};

export const generateAnchorElement = (page: PageElement, option: CommonOption) => (props: JSX.IntrinsicElements["a"]) => {
  const href: string = props.href ? rewriteHyperReference(props.href, page, option) : "";
  console.log({ uri: props.href, puri: page.uri, s: option.serverBasePath, href });
  const rewriteProps: JSX.IntrinsicElements["a"] = { ...props, href };
  return <a {...rewriteProps} />;
};
