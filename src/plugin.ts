import { CommonOption } from "@custom-site/cli";
import { PageElement } from "@custom-site/page";
import { PluginMap } from "@custom-site/plugin";

const pluginCache: PluginMap = {};

export const getPlugin = <T extends string>(key: T): PluginMap[T] | undefined => {
  if (Object.keys(pluginCache).includes(key)) {
    return pluginCache[key];
  }
  return;
};

export const updatePage = (page: PageElement, option: CommonOption): PageElement => {
  const plugins = option.plugins;
  const rewritePageFunctions = plugins.filter(plugin => plugin.name === "rewrite-page");
  let newPage = rewritePageFunctions.map(func => func page);
  return newPage;
};
