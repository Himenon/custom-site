import { CommonOption, Options } from "@custom-site/config";
import * as dot from "dot-prop";
import * as meow from "meow";
import * as path from "path";
import * as readPkgUp from "read-pkg-up";
import { getDefaultConfig } from "./helpers";

export const flags: meow.Options["flags"] = {
  dev: {
    alias: "D",
    type: "boolean",
  },
  open: {
    alias: "o",
    type: "boolean",
  },
  outDir: {
    alias: "d",
    type: "string",
  },
  port: {
    alias: "p",
    type: "string",
  },
  basePath: {
    type: "string",
  },
  layout: {
    type: "string",
  },
  components: {
    type: "string",
  },
  config: {
    alias: "c",
    type: "string",
  },
};

export interface InputFlags {
  outDir?: string;
  dev?: boolean;
  open?: boolean;
  port?: string;
  basePath?: string;
  layout?: string;
  config?: string;
  components?: string;
}

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
export const parser = (cli: meow.Result): Options => {
  const inputFlags: InputFlags = cli.flags;
  const cwd = process.cwd();
  const configDirectory = path.resolve(cwd, path.dirname(inputFlags.config || ""));
  const defaultConfig = getDefaultConfig(configDirectory, inputFlags.config || "config.json");
  const config = inputFlags.dev ? defaultConfig.develop : defaultConfig.build;
  const sourceDirectory: string = (config && config.source) || cwd;
  /**
   * package.jsonの"custom-site"に記述されたパラメータを読み取る
   */
  const pkg = readPkgUp.sync({ cwd: sourceDirectory }) || {};
  const port = inputFlags.port !== undefined ? parseInt(inputFlags.port, 10) : 8000;
  const commonOption: CommonOption = {
    baseDir: configDirectory,
    source: sourceDirectory,
    global: defaultConfig.global || {},
    destination: inputFlags.outDir ? path.join(process.cwd(), inputFlags.outDir) : undefined,
    basePath: getServerBasePath(inputFlags.basePath),
    port,
    blacklist: {
      extensions: [".mdx"],
    },
    layoutFile: inputFlags.layout,
    customComponentsFile: inputFlags.components,
    plugins: [],
  };

  if (inputFlags.dev) {
    return {
      develop: {
        open: true,
        ...commonOption,
        ...dot.get(pkg, "pkg.custom-site"),
        ...defaultConfig.develop,
      },
    };
  } else {
    return {
      build: { ...commonOption, ...dot.get(pkg, "pkg.custom-site"), ...defaultConfig.build },
    };
  }
};
