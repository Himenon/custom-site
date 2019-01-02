import * as fs from "fs";

import { Options } from "@rocu/cli";
import { HtmlMetaProperties } from "@rocu/page";
import * as path from "path";

const loadJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));

export interface RocuJsonOption extends Options {
  global?: HtmlMetaProperties;
}

export const getDefaultConfig = (dirname: string, filename: string = "rocu.json"): RocuJsonOption => {
  const filePath = path.join(dirname, filename);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return loadJsonFile(filePath);
  }
  return {
    global: {
      lang: "en",
    },
  };
};
