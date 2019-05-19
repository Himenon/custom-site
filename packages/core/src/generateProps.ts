import { CommonOption } from "@custom-site/interfaces";
import { Index, PageState, SiteState } from "@custom-site/interfaces/lib/page";

export const generateSiteState = (option: CommonOption): SiteState => {
  return {
    title: option.global.title || "",
    description: option.global.description || "",
    baseUri: option.baseUri,
    baseUrl: option.baseUrl,
  };
};

export const generateIndexes = (pages: PageState[]): Index[] => {
  return pages.map(page => ({
    title: page.metaData.title || "",
    uri: page.uri,
    tags: page.metaData.tags ? page.metaData.tags.split(",") : [],
  }));
};
