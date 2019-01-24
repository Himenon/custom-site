import { CommonOption } from "@custom-site/cli";
import { SiteState } from "@custom-site/page";

export const generateSiteState = (option: CommonOption): SiteState => {
  return {
    title: option.global.title || "",
    description: option.global.description || "",
    url: {
      relativePath: option.basePath || "",
      absolutePath: "",
    },
  };
};
