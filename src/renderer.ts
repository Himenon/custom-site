import { CommonOption } from "@custom-site/cli";
import { ExternalCustomComponent, ExternalTemplate, PageElement, RenderedStaticPage, SiteProps, Source } from "@custom-site/page";
import { CustomComponents } from "@mdx-js/tag";
import * as path from "path";
import { createTemplateHOC } from "./createTemplate";
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

const createTemplate = (site: SiteProps, page: PageElement, option: CommonOption) => {
  // TODO この位置にあるとパフォーマンスが悪い
  const externalTemplate = getExternalTemplate(option);
  return createTemplateHOC({
    pageProps: {
      site,
      article: generateArticleProps(page),
    },
    applyLayout: externalTemplate && externalTemplate.bodyTemplate,
  });
};

const createHead = (page: PageElement) => {
  const stateOfGenerateMetaDataId = `GENERATE_META_DATA/${page.uri}`;
  const stateOfGenerateMetaData = { metaData: page.metaData, id: stateOfGenerateMetaDataId };
  pluginStore.emit("GENERATE_META_DATA", stateOfGenerateMetaData);
  const metaData = internalStore.getState({ type: "GENERATE_META_DATA", id: stateOfGenerateMetaDataId }, stateOfGenerateMetaData).metaData;
  return createHeadContent(metaData);
};

const createBody = (page: PageElement, option: CommonOption) => {
  const externalCustomComponents = getExternalCustomComponents(option);
  const createBodyContent = transformRawStringToHtml({
    customComponents: {
      ...getCustomComponents(page, option),
      ...(externalCustomComponents && externalCustomComponents.customComponents()),
    },
    props: {},
  });
  const bodyContent = createBodyContent(page.content);
  return bodyContent;
};

/**
 * `option.serverBasePath`が存在する場合は、nameにつけて返す
 */
const renderPage = (site: SiteProps, option: CommonOption) => (page: PageElement): RenderedStaticPage => {
  const applyTemplate = createTemplate(site, page, option);
  return {
    name: path.join(option.basePath, page.name),
    originalName: page.name,
    html: combine({
      head: createHead(page),
      body: applyTemplate(createBody(page, option)),
    }),
  };
};

const render = async (source: Source, option: CommonOption): Promise<RenderedStaticPage[]> => {
  const siteProps = generateSiteProps(option);
  return source.pages.map(renderPage(siteProps, option));
};

export { render };
