import { Option as CLIOption } from "@custom-site/cli";
import { BuildOption, CommonOption, DevelopOption } from "@custom-site/config";
import * as path from "path";

export const getBaseUriPath = (text: string | undefined): string => {
  if (!text) {
    return "/";
  }
  if (text.startsWith("/")) {
    return text.trim();
  }
  return path.join("/", text).trim();
};

export const getDestination = (cwd: string, config?: CommonOption, option?: CLIOption): string => {
  if (config && config.destination) {
    return config.destination;
  }
  if (option && option.outDir) {
    return path.join(cwd, option.outDir);
  }
  throw Error(`Please set output directory destination.`);
};

/**
 * Overwrite Priority
 * cli arguments < package.json < config file
 */
export const parser = (config: CommonOption | undefined, isProduction: boolean, option: CLIOption = {}): BuildOption | DevelopOption => {
  const cwd = process.cwd();
  const configFile = option.config || "config.json";
  const source: string = (config && config.source) || cwd;
  const port = option.port !== undefined ? parseInt(option.port, 10) : (config && config.port) || 8000;
  const commonOption: CommonOption = {
    source,
    global: (config && config.global) || {},
    baseUri: getBaseUriPath(option.basePath),
    baseUrl: (config && config.baseUrl) || "",
    port,
    blacklist: {
      extensions: [".mdx"],
    },
    layoutFile: option.layout,
    customComponentsFile: option.components,
    plugins: [],
  };

  if (isProduction) {
    const destination = getDestination(cwd, config, option);
    const result: BuildOption = {
      ...commonOption,
      ...config,
      destination,
      configFile,
      __type: "PRODUCTION",
    };
    return result;
  } else {
    return {
      open: true,
      ...commonOption,
      ...config,
      configFile,
      port,
      __type: "DEVELOPMENT",
    };
  }
};
