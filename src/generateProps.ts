import { CommonOption } from "@custom-site/cli";
import { Article, Page, Site } from "@custom-site/page";

export const generateSiteProps = (option: CommonOption): Site => {
  return {
    title: option.global.title || "",
    description: option.global.description || "",
    url: {
      relativePath: option.basePath || "",
      absolutePath: "",
    },
  };
};

export const generateArticleProps = (page: Page): Article => {
  return {
    title: page.metaData.title || "",
    description: page.metaData.description || "",
    url: {
      relativePath: page.uri,
      absolutePath: "",
    },
  };
};
