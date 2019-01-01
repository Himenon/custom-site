import { BuildOption } from "@rocu/cli";
import * as fsExtra from "fs-extra";
import * as path from "path";

const isDirectory = (src: string) => {
  return fsExtra.existsSync(src) && fsExtra.statSync(src).isDirectory();
};

const isNotBlacklistPattern = (src: string, blacklist: BuildOption["blacklist"]) => {
  return !blacklist.extensions.includes(path.extname(src));
};

export const copyAssetFiles = async (option: BuildOption) => {
  await fsExtra.copy(option.source, option.destination, {
    filter: (targetPath: string) => {
      return isDirectory(targetPath) || isNotBlacklistPattern(targetPath, option.blacklist);
    },
    recursive: true,
  });
};
