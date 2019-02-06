import { CommonOption } from "@custom-site/config";
import { State as AppState } from "@custom-site/internal";
import { PluginFunctionMap, State as PluginState } from "@custom-site/plugin";
import * as path from "path";
import { CommandService as AppCommandService, QueryService as AppQueryService } from "./domain/config";
import { CommandService as PluginCommandService, QueryService as PluginQueryService } from "./domain/plugin";
import { Model } from "./models";
import { createPluginEventEmitter } from "./plugin";
import { resolvePlugin } from "./resolver";

const appModel = new Model<AppState>();
const pluginModel = new Model<PluginState>();
export const appQueryService = new AppQueryService(appModel);
export const appCommandService = new AppCommandService(appModel);
export const pluginQueryService = new PluginQueryService(pluginModel);
export const pluginCommandService = new PluginCommandService(pluginModel);
export const pluginEventEmitter = createPluginEventEmitter(pluginCommandService);

/**
 * 各種Storeの初期化
 * プラグインのリスナーを立てる
 */
export const init = (options: CommonOption) => {
  initOptions(options);
  initPlugins();
};

export const initPlugins = () => {
  const plugins = appQueryService.getPlugins();
  const pluginPaths: string[] = [];
  plugins.forEach(plugin2 => {
    const externalPlugin = resolvePlugin<PluginFunctionMap>(plugin2);
    if (!externalPlugin) {
      return;
    }
    const funcMap = externalPlugin.funcMap;
    pluginPaths.push(externalPlugin.path);
    pluginEventEmitter.on("GENERATE_META_DATA", funcMap.onGenerateMetaData);
    pluginEventEmitter.on("AFTER_RENDER_PAGE", funcMap.onAfterRenderPage);
  });
  appCommandService.savePluginPaths(pluginPaths);
};

export const initOptions = (options: CommonOption) => {
  const reCalculatePath = (oldPath?: string) => (oldPath ? path.join(path.dirname(options.configFile || ""), oldPath) : undefined);
  const state: CommonOption = {
    ...options,
    source: reCalculatePath(options.source) || options.source,
    customComponentsFile: reCalculatePath(options.customComponentsFile),
    layoutFile: reCalculatePath(options.layoutFile),
  };
  appCommandService.saveConfig(state);
  appCommandService.savePlugins(options.plugins);
};
