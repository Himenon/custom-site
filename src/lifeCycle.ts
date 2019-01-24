import { CommonOption } from "@custom-site/config";
import { PluginFunctionMap } from "@custom-site/plugin";
import { pluginEventEmitter } from "./plugin";
import { resolvePlugin } from "./resolver";
import { appStore } from "./store";

/**
 * 各種Storeの初期化
 * プラグインのリスナーを立てる
 */
export const init = (options: CommonOption) => {
  initOptions(options);
  initPlugins();
};

export const initPlugins = () => {
  const plugins = appStore.getState({ type: "PLUGINS", id: "" }, []);
  plugins.forEach(plugin => {
    const externalPlugin = resolvePlugin<PluginFunctionMap>(plugin);
    if (!externalPlugin) {
      return;
    }
    pluginEventEmitter.on("GENERATE_META_DATA", externalPlugin.onGenerateMetaData);
  });
};

export const initOptions = (options: CommonOption) => {
  appStore.saveState({
    type: "config",
    id: "",
    state: {
      ...options,
    },
  });
};
