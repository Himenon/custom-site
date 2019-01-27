// tslint:disable-next-line:no-reference
/// <reference path="../../typings/@custom-site/index.d.ts"/>

import { HtmlMetaData } from "@custom-site/page";
import { PluginFunctionMap } from "@custom-site/plugin";

export const onGenerateMetaData: PluginFunctionMap["onGenerateMetaData"] = payload => {
  const oldMetaData = payload.metaData;
  const newMetaData: HtmlMetaData = {
    ...oldMetaData,
    "og:title": oldMetaData.title,
  };
  return {
    metaData: newMetaData,
  };
};
