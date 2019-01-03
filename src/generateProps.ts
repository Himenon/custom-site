import { CommonOption } from "@custom-site/cli";
import { ArticleProps, PageElement, SiteProps } from "@custom-site/page";

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
