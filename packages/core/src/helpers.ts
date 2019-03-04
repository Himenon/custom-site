import * as fs from "fs";

import { CommonOption } from "@custom-site/config";

const loadJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));

export const getDefaultConfig = (filename: string): CommonOption | undefined => {
  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    try {
      return loadJsonFile(filename);
    } catch (e) {
      console.error(`"${filename}" include some syntax error.`);
      process.exit(1);
    }
  } else {
    console.error(`'${filename}' is not exists.`);
  }
  return;
};
