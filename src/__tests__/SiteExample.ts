import { PageState, SiteState } from "@custom-site/page";

export const siteStateExample: SiteState = {
  title: "test site",
  description: "test description",
  baseUri: "/test",
  baseUrl: "",
};

export const pageStateExamples: PageState[] = [
  {
    uri: "/a",
    content: "test page a",
    metaData: {
      title: "test page title a",
    },
    ext: ".mdx",
    filename: "a.mdx",
    name: "a",
    raw: "test page",
  },
  {
    uri: "/b",
    content: "test page b",
    metaData: {
      title: "test page title b",
    },
    ext: ".mdx",
    filename: "b.mdx",
    name: "b",
    raw: "test page",
  },
];
