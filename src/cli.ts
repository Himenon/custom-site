#!/usr/bin/env node

import * as http from "http";
import * as meow from "meow";
import opn = require("opn");
import * as path from "path";

import { UpdateNotifier } from "update-notifier";
import { notifyLog } from "./logger";

const pkg = require("../package.json");
new UpdateNotifier({ pkg }).notify();

import { generateStaticPages } from "./generator";
import { server } from "./server";

import { copyAssetFiles } from "./build/copyFiles";
import { exportPages } from "./exportPage";

import { Option } from "@custom-site/cli";
import { getDefaultConfig } from "./helpers";
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
  const inputFlags: Option = cli.flags;
  const isProduction: boolean = !inputFlags.dev;
  const defaultConfig = getDefaultConfig(inputFlags.config || "config.json");
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
        url = path.join(`http://localhost:${port}`, options.basePath);
      }
      if (options.open) {
        opn(url);
      }
    } catch (err) {
      notifyLog("error", err);
      process.exit(1);
    }
  }
  if (options.__type === "PRODUCTION") {
    // 開発環境ではなく、サイトを生成する
    const pages = await generateStaticPages(options);
    if (pages) {
      Promise.all([exportPages(pages, options), copyAssetFiles()]);
    }
  }
};

main();
