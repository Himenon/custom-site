// tslint:disable-next-line:no-reference
/// <reference path="../../typings/@custom-site/index.d.ts"/>

import { HtmlMetaData } from "@custom-site/page";
import { PluginFunctionMap } from "@custom-site/plugin";

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
          content: page.uri,
        },
      ],
    },
  };
  payload.page.metaData = { ...payload.page.metaData, ...newMetaData };
  return payload;
};
