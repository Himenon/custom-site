import { CommonOption, Options } from "@rocu/cli";
import * as dot from "dot-prop";
import * as meow from "meow";
import * as path from "path";
import * as readPkgUp from "read-pkg-up";

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
};

export interface InputFlags {
  outDir?: string;
  dev?: boolean;
  open?: boolean;
  port?: string;
  basePath?: string;
}

/**
 * Overwrite Priority
 * cli arguments < package.json < config file
 */
export const parser = (cli: meow.Result): Options => {
  const [source = process.cwd()] = cli.input;
  const inputFlags: InputFlags = cli.flags;
  /**
   * package.jsonの"rocu"に記述されたパラメータを読み取る
   */
  const pkg = readPkgUp.sync({ cwd: source }) || {};

  const commonOption: CommonOption = {
    source,
    destination: inputFlags.outDir ? path.join(process.cwd(), inputFlags.outDir) : undefined,
    serverBasePath: inputFlags.basePath,
    blacklist: {
      extensions: [".mdx"],
    },
  };

  if (inputFlags.dev) {
    return {
      develop: {
        ...commonOption,
        ...dot.get(pkg, "pkg.rocu"),
      },
    };
  } else {
    return {
      build: { ...commonOption, ...dot.get(pkg, "pkg.rocu") },
    };
  }
};
