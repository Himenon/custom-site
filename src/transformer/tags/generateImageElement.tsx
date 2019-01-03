import { CommonOption } from "@custom-site/cli";
import { PageElement } from "@custom-site/page";
import * as React from "react";
import { rewriteUrl } from "./helpers";

export const generateImageElement = (page: PageElement, option: CommonOption) => (props: JSX.IntrinsicElements["img"]) => {
  const src: string = props.src ? rewriteUrl(props.src, page, option) : "";
  const rewriteProps: JSX.IntrinsicElements["img"] = { ...props, src };
  return <img {...rewriteProps} />;
};
