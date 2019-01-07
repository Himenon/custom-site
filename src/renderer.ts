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
import { CustomComponents } from "@mdx-js/tag";
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
  const plugin = option.plugins;
  const externalCustomComponents = getExternalCustomComponents(option);
  const rewritePage = plugin.render.rewritePage ? plugin.render.rewritePage(page) : page;
  const createBodyContent = transformRawStringToHtml({
    customComponents: {
      ...getCustomComponents(rewritePage, option),
      ...(externalCustomComponents && externalCustomComponents.customComponents()),
    },
    props: {},
  });
  const pageProps: PageProps = {
    site: siteProps,
    article: generateArticleProps(rewritePage),
  };
  // TODO この位置にあるとパフォーマンスが悪い
  const externalTemplate = getExternalTemplate(option);
  const template = createTemplate({
    pageProps,
    applyLayout: externalTemplate && externalTemplate.bodyTemplate,
  });
  const bodyContent = createBodyContent(rewritePage.content);
  const headContent = createHeadContent(rewritePage.metaData);
  return {
    name: path.join(option.basePath, rewritePage.name),
    originalName: rewritePage.name,
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
