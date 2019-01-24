import { CommonOption } from "@custom-site/config";
import { PageState } from "@custom-site/page";
import * as React from "react";
import { rewriteUrl } from "./helpers";

export const generateImageElement = (page: PageState, option: CommonOption) => (props: JSX.IntrinsicElements["img"]) => {
  const src: string = props.src ? rewriteUrl(props.src, page, option) : "";
  const rewriteProps: JSX.IntrinsicElements["img"] = { ...props, src };
  return <img {...rewriteProps} />;
};
