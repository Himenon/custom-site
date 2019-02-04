import { CommonOption } from "@custom-site/config";
import { PageState, RenderedStaticPage, SiteState } from "@custom-site/page";
import { generateSiteState } from "./generateProps";
import { getPages } from "./getPage";
import { init, appQueryService } from "./lifeCycle";
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
