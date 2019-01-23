import { pluginEventEmitter } from "./plugin";
import { resolvePlugin } from "./resolver";
import { appStore } from "./store";

/**
 * 各種Storeの初期化
 * プラグインのリスナーを立てる
 */
export const init = () => {
  initPlugins();
};

export const initPlugins = () => {
  const plugins = appStore.getState({ type: "PLUGINS", id: "" });
  plugins.forEach(plugin => {
    const externalPlugin = resolvePlugin(plugin);
    // TOOD 取得したプラグインの型のValidationをつくる
    pluginEventEmitter.on("GENERATE_META_DATA", externalPlugin);
  });
};