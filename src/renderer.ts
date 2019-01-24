import { CommonOption } from "@custom-site/config";
import { ExternalCustomComponent, ExternalTemplate, PageState, RenderedStaticPage, SiteState, Source } from "@custom-site/page";
import { CustomComponents } from "@mdx-js/tag";
import * as path from "path";
import { createTemplateHOC } from "./createTemplate";
import { generateSiteState } from "./generateProps";
import { loadExternalFunction } from "./importer";
import { pluginEventEmitter } from "./plugin";
import { appStore, pluginStore } from "./store";
import { combine, createHeadContent, transformRawStringToHtml } from "./transformer";
import { generateAnchorElement } from "./transformer/tags/generateAnchorElement";
import { generateImageElement } from "./transformer/tags/generateImageElement";

const getCustomComponents = (page: PageState, option: CommonOption): CustomComponents => {
  return {
    a: generateAnchorElement(page, option),
    img: generateImageElement(page, option),
  };
};

const getExternalTemplate = (): ExternalTemplate | undefined => {
  const config = appStore.getState({ type: "config", id: "" });
  if (!config || !config.layoutFile) {
    return;
  }
  return loadExternalFunction<ExternalTemplate>(config.layoutFile);
};

const getExternalCustomComponents = (): ExternalCustomComponent | undefined => {
  const config = appStore.getState({ type: "config", id: "" });
  if (!config || !config.customComponentsFile) {
    return;
  }
  return loadExternalFunction<ExternalCustomComponent>(config.customComponentsFile);
};

const createTemplate = (site: SiteState, page: PageState) => {
  // TODO この位置にあるとパフォーマンスが悪い
  const externalTemplate = getExternalTemplate();
  return createTemplateHOC({
    postProps: { site, page },
    createTemplateFunction: externalTemplate && externalTemplate.createBodyTemplateFunction,
  });
};

const createHead = (page: PageState) => {
  const id = `GENERATE_META_DATA/${page.uri}`;
  const state = { metaData: page.metaData, id };
  pluginEventEmitter.emit("GENERATE_META_DATA", state);
  const metaData = pluginStore.getState({ type: "GENERATE_META_DATA", id }, state).metaData;
  return createHeadContent(metaData);
};

const createBody = (page: PageState, option: CommonOption) => {
  const externalCustomComponents = getExternalCustomComponents();
  const createBodyContent = transformRawStringToHtml({
    customComponents: {
      ...getCustomComponents(page, option),
      ...(externalCustomComponents && externalCustomComponents.generateCustomComponents()),
    },
    props: {},
  });
  return createBodyContent(page.content);
};

/**
 * `option.serverBasePath`が存在する場合は、nameにつけて返す
 */
const renderPage = (site: SiteState, option: CommonOption) => (page: PageState): RenderedStaticPage => {
  const applyTemplate = createTemplate(site, page);
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
  const siteState = generateSiteState(option);
  return source.pages.map(renderPage(siteState, option));
};

export { render };
