#!/usr/bin/env node

import * as http from "http";
import * as meow from "meow";
import opn = require("opn");

import { UpdateNotifier } from "update-notifier";
import { notifyLog } from "./logger";

const pkg = require("../package.json");
new UpdateNotifier({ pkg }).notify();

import { generateStaticPages } from "./generator";
import { server } from "./server";

import { copyAssetFiles } from "./build/copyFiles";
import { exportPages } from "./repository/exportPage";

import { parser } from "./cliParser";

const cli = meow(
  `
  Usage:
    $ rocu dirname

  Options:
    --out-dir, -d   Output directory
    --dev, -D       Start development server
    --port, -p      Set port for development server
    --open, -o      Open development server in default browser
`,
  {
    flags: {
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
    },
  },
);

const { develop: developOptions, build: buildOptions } = parser(cli);

notifyLog("rocu");

const main = async () => {
  if (developOptions) {
    notifyLog("starting dev server");
    try {
      const srv: http.Server = await server(developOptions.source, developOptions);
      const address = srv.address();
      let url: string;
      if (typeof address === "string") {
        notifyLog(`listening on ${address}`);
        url = address;
      } else {
        const { port } = address;
        notifyLog(`listening on port: ${port}`);
        url = `http://localhost:${port}`;
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
    const dest = buildOptions.destination;
    if (!dest) {
      console.error("Error: did not set output directory");
      return;
    }
    const pages = await generateStaticPages(buildOptions.source, buildOptions);
    if (pages) {
      Promise.all([exportPages(pages, dest), copyAssetFiles(buildOptions.source, dest)]);
    }
  }
};

main();
