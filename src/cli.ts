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

import { flags, parser } from "./parser";

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

const { develop: developOptions, build: buildOptions } = parser(cli);

notifyLog("custom-site");

const main = async () => {
  if (developOptions) {
    notifyLog("starting dev server");
    try {
      const srv: http.Server = await server(developOptions);
      const address = srv.address();
      let url: string;
      if (typeof address === "string") {
        notifyLog(`listening on ${address}`);
        url = address;
      } else {
        const { port } = address;
        notifyLog(`listening on port: ${port}`);
        url = path.join(`http://localhost:${port}`, developOptions.basePath);
      }
      if (developOptions.open) {
        opn(url);
      }
    } catch (err) {
      notifyLog("error", err);
      process.exit(1);
    }
  }
  if (buildOptions) {
    // 開発環境ではなく、サイトを生成する
    const pages = await generateStaticPages(buildOptions);
    if (pages) {
      Promise.all([exportPages(pages, buildOptions), copyAssetFiles()]);
    }
  }
};

main();
