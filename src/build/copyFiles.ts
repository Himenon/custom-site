import { CommonOption } from "@rocu/cli";
import * as fsExtra from "fs-extra";
import * as path from "path";

const isDirectory = (src: string) => {
  return fsExtra.existsSync(src) && fsExtra.statSync(src).isDirectory();
};

const isIgnoreExtensions = (src: string, blacklist: CommonOption["blacklist"]) => {
  return !blacklist.extensions.includes(path.extname(src));
};

export const copyAssetFiles = async (src: string, dest: string, option: CommonOption) => {
  await fsExtra.copy(src, path.join(dest, option.serverBasePath), {
    filter: (targetPath: string) => {
      return isDirectory(targetPath) || isIgnoreExtensions(targetPath, option.blacklist);
    },
    recursive: true,
  });
};
