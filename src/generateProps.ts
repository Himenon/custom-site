import { CommonOption } from "@rocu/cli";
import { ArticleProps, PageElement, SiteProps } from "@rocu/page";

export const generateSiteProps = (option: CommonOption): SiteProps => {
  return {
    title: option.global.title || "",
    description: option.global.description || "",
    url: {
      relativePath: option.serverBasePath || "",
      absolutePath: "",
    },
  };
};

export const generateArticleProps = (page: PageElement): ArticleProps => {
  return {
    title: page.metaData.title || "",
    description: page.metaData.description || "",
    url: {
      relativePath: page.uri,
      absolutePath: "",
    },
  };
};
