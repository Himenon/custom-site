import { CommonOption } from "@custom-site/interfaces";
import { PageState, RenderedStaticPage, SiteState } from "@custom-site/interfaces/lib/page";
import { generateSiteState } from "./generateProps";
import { getPages } from "./getPage";
import { appQueryService, init } from "./lifeCycle";
import { render } from "./renderer";

/**
 * Site Generate API
 */
export const generateStatic = async (site: SiteState, pages: PageState[]): Promise<RenderedStaticPage[]> => {
  return render(site, pages);
};

/**
 * Native APi
 * @param options
 */
export const generateStaticPages = async (options: CommonOption): Promise<RenderedStaticPage[]> => {
  init(options);
  const config = appQueryService.getConfig();
  if (config) {
    const pages = await getPages(config);
    const site = generateSiteState(config);
    return generateStatic(site, pages);
  }
  return [];
};
