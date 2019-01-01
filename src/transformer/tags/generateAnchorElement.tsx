import { CommonOption } from "@rocu/cli";
import { PageElement } from "@rocu/page";
import * as React from "react";
import { rewriteUrl } from "./helpers";

export const generateAnchorElement = (page: PageElement, option: CommonOption) => (props: JSX.IntrinsicElements["a"]) => {
  const href: string = props.href ? rewriteUrl(props.href, page, option) : "";
  const rewriteProps: JSX.IntrinsicElements["a"] = { ...props, href };
  return <a {...rewriteProps} />;
};
