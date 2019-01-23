import { CommonOption } from "@custom-site/cli";
import { ExternalCustomComponent, ExternalTemplate, PageState, RenderedStaticPage, SiteState, Source } from "@custom-site/page";
import { CustomComponents } from "@mdx-js/tag";
import * as path from "path";
import { createTemplateHOC } from "./createTemplate";
import { generateSiteState } from "./generateProps";
import { loadExternalFunction } from "./importer";
import { pluginEventEmitter } from "./plugin";
import { pluginStore } from "./store";
import { combine, createHeadContent, transformRawStringToHtml } from "./transformer";
import { generateAnchorElement } from "./transformer/tags/generateAnchorElement";
import { generateImageElement } from "./transformer/tags/generateImageElement";

const getCustomComponents = (page: PageState, option: CommonOption): CustomComponents => {
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

const createTemplate = (site: SiteState, page: PageState, option: CommonOption) => {
  // TODO この位置にあるとパフォーマンスが悪い
  const externalTemplate = getExternalTemplate(option);
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
  const externalCustomComponents = getExternalCustomComponents(option);
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
  const siteState = generateSiteState(option);
  return source.pages.map(renderPage(siteState, option));
};

export { render };
