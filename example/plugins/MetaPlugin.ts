import { HtmlMetaData } from "@custom-site/interfaces/lib/page";
import { PluginFunctionMap } from "@custom-site/interfaces/lib/plugin";
import * as path from "path";
const pretty = require("pretty");

export const onGenerateMetaData: PluginFunctionMap["onGenerateMetaData"] = payload => {
  const page = payload.page;
  const newMetaData: HtmlMetaData = {
    extend: {
      meta: [
        {
          property: "og:title",
          content: page.metaData.title,
        },
        {
          property: "og:url",
          content: path.join(payload.site.baseUrl, page.uri),
        },
      ],
    },
  };
  payload.page.metaData = { ...payload.page.metaData, ...newMetaData };
  return payload;
};

export const onAfterRenderPage: PluginFunctionMap["onAfterRenderPage"] = payload => {
  return {
    html: pretty(payload.html),
  };
};
