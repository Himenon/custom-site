import { PageState } from "@custom-site/page";
import * as React from "react";
import { rewriteUrl } from "./helpers";

export const generateImageElement = (page: PageState, basePath: string) => (props: JSX.IntrinsicElements["img"]) => {
  const src: string = props.src ? rewriteUrl(props.src, page, basePath) : "";
  const rewriteProps: JSX.IntrinsicElements["img"] = { ...props, src };
  return <img {...rewriteProps} />;
};
