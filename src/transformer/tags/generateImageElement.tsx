import { CommonOption } from "@rocu/cli";
import { PageElement } from "@rocu/page";
import * as React from "react";
import { rewriteUrl } from "./helpers";

export const generateImageElement = (page: PageElement, option: CommonOption) => (props: JSX.IntrinsicElements["img"]) => {
  const src: string = props.src ? rewriteUrl(props.src, page, option) : "";
  const rewriteProps: JSX.IntrinsicElements["img"] = { ...props, src };
  return <img {...rewriteProps} />;
};
