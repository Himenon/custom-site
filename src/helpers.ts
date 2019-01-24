import * as fs from "fs";

import { Options } from "@custom-site/config";
import { HtmlMetaData } from "@custom-site/page";
import * as path from "path";

const loadJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));

export interface LoadConfigOption extends Options {
  global?: HtmlMetaData;
}

export const getDefaultConfig = (dirname: string, filename: string = "config.json"): LoadConfigOption => {
  const filePath = path.join(dirname, filename);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    try {
      return loadJsonFile(filePath);
    } catch (e) {
      console.error(`"${filePath}" include some syntax error.`);
      process.exit(1);
    }
  }
  return {
    global: {
      lang: "en",
    },
  };
};
