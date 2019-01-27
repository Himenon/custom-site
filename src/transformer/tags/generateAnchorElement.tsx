import { PageState } from "@custom-site/page";
import * as React from "react";
import { rewriteUrl } from "./helpers";

export const generateAnchorElement = (page: PageState, basePath: string) => (props: JSX.IntrinsicElements["a"]) => {
  const href: string = props.href ? rewriteUrl(props.href, page, basePath) : "";
  const rewriteProps: JSX.IntrinsicElements["a"] = { ...props, href };
  return <a {...rewriteProps} />;
};
