import {
  ExternalCustomComponent,
  ExternalTemplate,
  HtmlMetaData,
  Index,
  PageState,
  RenderedStaticPage,
  SiteState,
} from "@custom-site/interfaces/lib/page";
import { CustomComponents } from "@mdx-js/react";
import * as path from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { createTemplateHOC } from "./createTemplate";
import { generateIndexes } from "./generateProps";
import { appQueryService, pluginEventEmitter, pluginQueryService } from "./lifeCycle";
import { loadExternalFunction } from "./resolver/importer";
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
  const layoutFile = appQueryService.getLayoutFile();
  if (!layoutFile) {
    return;
  }
  return loadExternalFunction<ExternalTemplate>(layoutFile);
};

const getExternalCustomComponents = (): ExternalCustomComponent | undefined => {
  const customComponentsFile = appQueryService.getCustomComponentsFile();
  if (!customComponentsFile) {
    return;
  }
  return loadExternalFunction<ExternalCustomComponent>(customComponentsFile);
};

const createTemplate = (site: SiteState, page: PageState, indexes: Index[]) => {
  // TODO この位置にあるとパフォーマンスが悪い
  const externalTemplate = getExternalTemplate();
  return createTemplateHOC({
    postProps: { site, page, indexes },
    createTemplateFunction: externalTemplate && externalTemplate.createBodyTemplateFunction,
  });
};

const createHead = (site: SiteState, page: PageState): { htmlMetaData: HtmlMetaData; element: React.ReactElement<any> } => {
  const id = `GENERATE_META_DATA/${page.uri}`;
  const state = { site, page, id };
  pluginEventEmitter.emit("GENERATE_META_DATA", state);
  const metaData = pluginQueryService.getGenerateMetaData(id);
  return {
    htmlMetaData: metaData,
    element: createHeadContent(metaData),
  };
};

const createBody = (page: PageState, site: SiteState) => {
  const externalCustomComponents = getExternalCustomComponents();
  const createBodyContent = transformRawStringToHtml({
    customComponents: {
      ...getCustomComponents(page, site.baseUri),
      ...(externalCustomComponents ? externalCustomComponents.generateCustomComponents() : {}),
    },
    props: {},
  });
  return createBodyContent(page.content);
};

/**
 * `option.serverBasePath`が存在する場合は、nameにつけて返す
 */
const createRenderPage = (site: SiteState, indexes: Index[]) => (page: PageState): RenderedStaticPage => {
  const applyTemplate = createTemplate(site, page, indexes);
  const id = `AFTER_RENDER_PAGE/${page.uri}`;
  const headContent = createHead(site, page);
  const html = renderToStaticMarkup(
    combine({
      csrProps: {
        htmlMetaData: headContent.htmlMetaData,
        page,
        site,
      },
      head: headContent.element,
      body: applyTemplate(createBody(page, site)),
    }),
  );
  const state = { id, html };
  pluginEventEmitter.emit("AFTER_RENDER_PAGE", state);
  const result = pluginQueryService.getAfterRenderPage(id);
  return {
    name: path.join(site.baseUri, page.name),
    originalName: page.name,
    html: result,
  };
};

const render = async (site: SiteState, pages: PageState[]): Promise<RenderedStaticPage[]> => {
  const indexes = generateIndexes(pages);
  const renderPage = createRenderPage(site, indexes);
  return Promise.all(pages.map(renderPage));
};

export { render };
