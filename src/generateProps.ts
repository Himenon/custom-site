import { CommonOption } from "@custom-site/config";
import { SiteState } from "@custom-site/page";

export const generateSiteState = (option: CommonOption): SiteState => {
  return {
    title: option.global.title || "",
    description: option.global.description || "",
    baseUri: option.baseUri,
    baseUrl: option.baseUrl,
  };
};
