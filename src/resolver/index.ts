import { Plugin } from "@custom-site/plugin";
import normalize = require("normalize-path");
// tslint:disable
const Module = require("module");

export const getPluginPath = (pluginName: string, fromDir?: string): string | undefined => {
  const resolveFileName = () =>
    Module._resolveFilename(pluginName, {
      id: "",
      filename: "",
      paths: Module._nodeModulePaths(fromDir || process.cwd()),
    });
  try {
    return resolveFileName();
  } catch (err) {
    return;
  }
};

export const resolvePluginByName = <T>(pluginName: string, fromDir?: string): T | undefined => {
  const pluginPath = getPluginPath(pluginName, fromDir || process.cwd());
  if (pluginPath) {
    return require(pluginPath);
  }
  return undefined;
};

/**
 * プラグインを探索する
 */
export const resolvePlugin = <T>(plugin: Plugin): T | undefined => {
  if (typeof plugin === "string") {
    return resolvePluginByName(normalize(plugin));
  }
  return resolvePluginByName(plugin.name, plugin.resolve);
};
