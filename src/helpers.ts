import * as fs from "fs";

import { BuildOption, DevelopOption } from "@custom-site/config";

const loadJsonFile = (filePath: string) => JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));

export const getDefaultConfig = (filename: string): DevelopOption | BuildOption | undefined => {
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
