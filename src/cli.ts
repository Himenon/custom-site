#!/usr/bin/env node

import * as dot from "dot-prop";
import * as http from "http";
import * as meow from "meow";
import opn = require("opn");
import * as path from "path";
import * as readPkgUp from "read-pkg-up";

import { UpdateNotifier } from "update-notifier";
import { notifyLog } from "./logger";

import { generateStaticPages } from "./generator";
import { server } from "./server";

import { copyAssetFiles, copyNodeModulesLibs, exportPages } from "./build-tools";

import { Option } from "@custom-site/cli";
import { getDefaultConfig } from "./helpers";
import { appQueryService } from "./lifeCycle";
import { parser } from "./parser";

const flags: meow.Options["flags"] = {
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

const cli = meow(
  `
  Usage:
    $ custom-site dirname

  Options:
    --out-dir, -d   Output directory
    --dev, -D       Start development server
    --port, -p      Set port for development server
    --open, -o      Open development server in default browser
    --layout        Layout File Path
    --config, -c    Config File Path
`,
  {
    flags,
  },
);

const main = async () => {
  const pkg = readPkgUp.sync().pkg;
  new UpdateNotifier({ pkg }).notify();
  const inputFlags: Option = cli.flags;
  const isProduction: boolean = !inputFlags.dev;
  const packageConfig = dot.get(pkg, "pkg.custom-site");
  const defaultConfig = { ...getDefaultConfig(inputFlags.config || "config.json"), ...packageConfig };
  const options = parser(defaultConfig, isProduction, inputFlags);
  notifyLog("custom-site");
  if (options.__type === "DEVELOPMENT") {
    notifyLog("starting dev server");
    try {
      const srv: http.Server = await server(options);
      const address = srv.address();
      let url: string;
      if (typeof address === "string") {
        notifyLog(`listening on ${address}`);
        url = address;
      } else {
        const { port } = address;
        notifyLog(`listening on port: ${port}`);
        url = path.join(`http://localhost:${port}`, options.baseUri);
      }
      if (options.open) {
        opn(url);
      }
    } catch (err) {
      notifyLog("error");
      console.error(err);
      process.exit(1);
    }
  }
  if (options.__type === "PRODUCTION") {
    try {
      // 開発環境ではなく、サイトを生成する
      const pages = await generateStaticPages(options);
      Promise.all([
        exportPages(pages, options),
        copyAssetFiles(options.source, options.destination, options.blacklist.extensions),
        copyNodeModulesLibs(appQueryService.getCssFiles(), options.destination),
      ]);
      notifyLog("files saved to", options.destination);
    } catch (err) {
      notifyLog("error", err);
      process.exit(1);
    }
  }
};

main();
