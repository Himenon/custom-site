import { CommonOption } from "@custom-site/cli";
import { Page } from "@custom-site/page";
import * as React from "react";
import { rewriteUrl } from "./helpers";

export const generateAnchorElement = (page: Page, option: CommonOption) => (props: JSX.IntrinsicElements["a"]) => {
  const href: string = props.href ? rewriteUrl(props.href, page, option) : "";
  const rewriteProps: JSX.IntrinsicElements["a"] = { ...props, href };
  return <a {...rewriteProps} />;
};
