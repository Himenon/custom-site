import { Option as CLIOption } from "@custom-site/cli";
import { BuildOption, CommonOption, DevelopOption } from "@custom-site/config";
import * as dot from "dot-prop";
import * as path from "path";
import * as readPkgUp from "read-pkg-up";

export const getServerBasePath = (text: string | undefined): string => {
  if (!text) {
    return "/";
  }
  if (text.startsWith("/")) {
    return text.trim();
  }
  return path.join("/", text).trim();
};

/**
 * Overwrite Priority
 * cli arguments < package.json < config file
 */
export const parser = (
  defaultConfig: DevelopOption | BuildOption | undefined,
  isProduction: boolean,
  option: CLIOption = {},
): BuildOption | DevelopOption => {
  const cwd = process.cwd();
  const config = defaultConfig;
  const configFile = option.config || "config.json";
  const source: string = (config && config.source) || cwd;
  /**
   * package.jsonの"custom-site"に記述されたパラメータを読み取る
   */
  const pkg = readPkgUp.sync({ cwd }) || {};
  const port = option.port !== undefined ? parseInt(option.port, 10) : 8000;
  const commonOption: CommonOption = {
    configFile: config && configFile,
    source,
    global: (config && config.global) || {},
    destination: option.outDir ? path.join(process.cwd(), option.outDir) : undefined,
    basePath: getServerBasePath(option.basePath),
    port,
    blacklist: {
      extensions: [".mdx"],
    },
    layoutFile: option.layout,
    customComponentsFile: option.components,
    plugins: [],
  };

  if (isProduction) {
    return {
      ...commonOption,
      ...dot.get(pkg, "pkg.custom-site"),
      ...config,
      __type: "PRODUCTION",
    };
  } else {
    return {
      open: true,
      ...commonOption,
      ...dot.get(pkg, "pkg.custom-site"),
      ...config,
      __type: "DEVELOPMENT",
    };
  }
};
