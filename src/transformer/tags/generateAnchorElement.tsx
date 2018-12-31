import { CommonOption } from "@rocu/cli";
import { PageElement } from "@rocu/page";
import * as path from "path";
import * as React from "react";

/**
 * @param uri aタグのhref
 * @param page page.uriはoption.serverBasePathをすでに加算した状態で存在する
 * @param option 相対パスの算出では利用しない
 */
export const rewriteHyperReference = (uri: string, page: PageElement, option: CommonOption): string => {
  if (uri.startsWith("/")) {
    return path.join(option.serverBasePath, uri);
  }
  if (uri.startsWith("../")) {
    return path.join(path.dirname(page.uri), uri).replace(/\/$/, "");
  }
  // start current directory
  // const uriParts = page.uri.endsWith("/") ? page.uri.split("/") : (page.uri + "/").split("/");
  // uriParts[uriParts.length - 1] = uri.startsWith("./") ? uri.slice(2) : uri;
  const t = path.join("/", path.dirname(page.uri), uri).replace(/\/$/, "");
  if (option.serverBasePath !== "" && !t.startsWith(option.serverBasePath)) {
    return path.join(option.serverBasePath, t);
  }
  return t;
};

export const generateAnchorElement = (page: PageElement, option: CommonOption) => (props: JSX.IntrinsicElements["a"]) => {
  const href: string = props.href ? rewriteHyperReference(props.href, page, option) : "";
  console.log({ uri: props.href, pageUri: page.uri, basePath: option.serverBasePath, href });
  const rewriteProps: JSX.IntrinsicElements["a"] = { ...props, href };
  console.log(rewriteProps);
  return <a {...rewriteProps} />;
};
