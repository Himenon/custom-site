import { ExternalCustomComponent, ExternalTemplate, PageState, RenderedStaticPage, SiteState } from "@custom-site/page";
import { CustomComponents } from "@mdx-js/tag";
import * as path from "path";
import { createTemplateHOC } from "./createTemplate";
import { loadExternalFunction } from "./importer";
import { pluginEventEmitter } from "./plugin";
import { app, plugin } from "./store";
import { combine, createHeadContent, transformRawStringToHtml } from "./transformer";
import { generateAnchorElement } from "./transformer/tags/generateAnchorElement";
import { generateImageElement } from "./transformer/tags/generateImageElement";

const getCustomComponents = (page: PageState, basePath: string): CustomComponents => {
  return {
    a: generateAnchorElement(page, basePath),
    img: generateImageElement(page, basePath),
  };
};

const getExternalTemplate = (): ExternalTemplate | undefined => {
  const config = app.get({ type: "config", id: "" });
  if (!config || !config.layoutFile) {
    return;
  }
  return loadExternalFunction<ExternalTemplate>(config.layoutFile);
};

const getExternalCustomComponents = (): ExternalCustomComponent | undefined => {
  const config = app.get({ type: "config", id: "" });
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
  const metaData = plugin.get({ type: "GENERATE_META_DATA", id }, state).metaData;
  return createHeadContent(metaData);
};

const createBody = (page: PageState, site: SiteState) => {
  const externalCustomComponents = getExternalCustomComponents();
  const createBodyContent = transformRawStringToHtml({
    customComponents: {
      ...getCustomComponents(page, site.basePath),
      ...(externalCustomComponents && externalCustomComponents.generateCustomComponents()),
    },
    props: {},
  });
  return createBodyContent(page.content);
};

/**
 * `option.serverBasePath`が存在する場合は、nameにつけて返す
 */
const createRenderPage = (site: SiteState) => (page: PageState): RenderedStaticPage => {
  const applyTemplate = createTemplate(site, page);
  return {
    name: path.join(site.basePath, page.name),
    originalName: page.name,
    html: combine({
      head: createHead(page),
      body: applyTemplate(createBody(page, site)),
    }),
  };
};

const render = async (site: SiteState, pages: PageState[]): Promise<RenderedStaticPage[]> => {
  const renderPage = createRenderPage(site);
  return pages.map(renderPage);
};

export { render };
