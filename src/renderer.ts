import { CustomComponents } from "@mdx-js/tag";
import { CommonOption } from "@custom-site/cli";
import {
  ExternalCustomComponent,
  ExternalTemplate,
  PageElement,
  PageProps,
  RenderedStaticPage,
  SiteProps,
  Source,
} from "@custom-site/page";
import * as path from "path";
import { createTemplate } from "./createTemplate";
import { generateArticleProps, generateSiteProps } from "./generateProps";
import { loadExternalFunction } from "./importer";
import { combine, createHeadContent, transformRawStringToHtml } from "./transformer";
import { generateAnchorElement } from "./transformer/tags/generateAnchorElement";
import { generateImageElement } from "./transformer/tags/generateImageElement";

const getCustomComponents = (page: PageElement, option: CommonOption): CustomComponents => {
  return {
    a: generateAnchorElement(page, option),
    img: generateImageElement(page, option),
  };
};

const getExternalTemplate = (option: CommonOption): ExternalTemplate | undefined => {
  const filename = option.layoutFile;
  if (!filename) {
    return;
  }
  return loadExternalFunction<ExternalTemplate>(filename);
};

const getExternalCustomComponents = (option: CommonOption): ExternalCustomComponent | undefined => {
  const filename = option.customComponentsFile;
  if (!filename) {
    return;
  }
  return loadExternalFunction<ExternalCustomComponent>(filename);
};

/**
 * `option.serverBasePath`が存在する場合は、nameにつけて返す
 */
const renderPage = (siteProps: SiteProps, option: CommonOption) => (page: PageElement): RenderedStaticPage => {
  const externalCustomComponents = getExternalCustomComponents(option);
  const createBodyContent = transformRawStringToHtml({
    customComponents: {
      ...getCustomComponents(page, option),
      ...(externalCustomComponents && externalCustomComponents.customComponents()),
    },
    props: {},
  });
  const pageProps: PageProps = {
    site: siteProps,
    article: generateArticleProps(page),
  };
  // TODO この位置にあるとパフォーマンスが悪い
  const externalTemplate = getExternalTemplate(option);
  const template = createTemplate({
    pageProps,
    applyLayout: externalTemplate && externalTemplate.bodyTemplate,
  });
  const bodyContent = createBodyContent(page.content);
  const headContent = createHeadContent(page.metaData);
  return {
    name: path.join(option.serverBasePath, page.name),
    originalName: page.name,
    html: combine({
      head: headContent,
      body: template(bodyContent),
    }),
  };
};

const render = async (source: Source, option: CommonOption): Promise<RenderedStaticPage[]> => {
  const siteProps = generateSiteProps(option);
  return source.pages.map(renderPage(siteProps, option));
};

export { render };
