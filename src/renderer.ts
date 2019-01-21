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
import { store as pluginStore } from "./plugin";
import { store as internalStore } from "./store";
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
  const id1 = `GENERATE_PAGE/${page.uri}`;
  const stateOfGeneratePage = { id: id1, page };
  pluginStore.emit("GENERATE_PAGE", { id: id1, page });
  const rewritePage: PageElement = internalStore.getState({ type: "GENERATE_PAGE", id: id1 }, stateOfGeneratePage).page;
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

  const stateOfGenerateMetaDataId = `GENERATE_META_DATA/${page.uri}`;
  const stateOfGenerateMetaData = { page: rewritePage, metaData: rewritePage.metaData, id: stateOfGenerateMetaDataId };
  pluginStore.emit("GENERATE_META_DATA", stateOfGenerateMetaData);
  const metaData = internalStore.getState({ type: "GENERATE_META_DATA", id: stateOfGenerateMetaDataId }, stateOfGenerateMetaData).metaData;
  const bodyContent = createBodyContent(rewritePage.content);
  const headContent = createHeadContent(metaData);
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
