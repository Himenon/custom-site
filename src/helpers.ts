import * as fs from "fs";

import { Options } from "@custom-site/config";
import { HtmlMetaData } from "@custom-site/page";

const loadJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));

export interface LoadConfigOption extends Options {
  global?: HtmlMetaData;
}

export const getDefaultConfig = (filename: string): LoadConfigOption | undefined => {
  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    try {
      return loadJsonFile(filename);
    } catch (e) {
      console.error(`"${filename}" include some syntax error.`);
      process.exit(1);
    }
  }
  return;
};
