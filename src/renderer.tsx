import { BuildOption, CommonOption } from "@rocu/cli";
import { PageElement, RenderedStaticPage, Source } from "@rocu/page";
import * as path from "path";
import * as React from "react";
import { combine, createHeadContent, transformRawStringToHtml } from "./transformer";

const getCustomComponents = (option: CommonOption) => {
  return {
    a: (props: JSX.IntrinsicElements["a"]) => {
      console.log(props);
      const rewriteHref =
        typeof props.href === "string" && props.href.startsWith("./") ? props.href : path.join(option.serverBasePath, props.href || "");
      const rewriteProps: JSX.IntrinsicElements["a"] = { ...props, href: rewriteHref };
      return <a {...rewriteProps} />;
    },
  };
};

/**
 * `option.serverBasePath`が存在する場合は、nameにつけて返す
 */
const renderPage = (option: BuildOption) => (page: PageElement): RenderedStaticPage => {
  const createBodyContent = transformRawStringToHtml({
    customComponents: getCustomComponents(option),
    props: {},
  });
  const bodyContent = createBodyContent(page.content);
  const headContent = createHeadContent(page.metaData);
  return {
    name: path.join(option.serverBasePath, page.name),
    html: combine({
      head: headContent,
      body: bodyContent,
    }),
  };
};

const render = async ({ pages = [] }: Source, option: BuildOption): Promise<RenderedStaticPage[]> => {
  return pages.map(renderPage(option));
};

export { render };
