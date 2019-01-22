import { store as pluginStore } from "./plugin";
import { resolvePlugin } from "./resolver";
import { store as internalStore } from "./store";

/**
 * 各種Storeの初期化
 * プラグインのリスナーを立てる
 */
export const init = () => {
  initPlugins();
};

export const initPlugins = () => {
  const plugins = internalStore.getState({ type: "PLUGINS", id: "" });
  plugins.forEach(plugin => {
    const externalPlugin = resolvePlugin(plugin);
    pluginStore.on("GENERATE_META_DATA", externalPlugin);
  });
};
