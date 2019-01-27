import { CommonOption } from "@custom-site/config";
import { PageState, RenderedStaticPage, SiteState } from "@custom-site/page";
import { generateSiteState } from "./generateProps";
import { getPages } from "./getPage";
import { init } from "./lifeCycle";
import { notifyLog } from "./logger";
import { render } from "./renderer";
import { app } from "./store";

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
export const generateStaticPages = async (options: CommonOption): Promise<RenderedStaticPage[] | undefined> => {
  init(options);
  const config = app.get({ type: "config", id: "" }, options);
  const pages = await getPages(config);
  const site = generateSiteState(options);
  try {
    const result = await generateStatic(site, pages);
    notifyLog("files saved to", config.source);
    return result;
  } catch (err) {
    notifyLog("error", err);
    process.exit(1);
  }
  return;
};
