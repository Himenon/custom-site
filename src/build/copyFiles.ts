import * as fsExtra from "fs-extra";
import * as path from "path";

const BLACK_LIST = [".css", ".js", ".png", ".jpeg", ".jpg", ".gif"];

const isDirectory = (src: string) => {
  return fsExtra.existsSync(src) && fsExtra.statSync(src).isDirectory();
};

const isAssetFile = (src: string) => {
  return BLACK_LIST.includes(path.extname(src));
};

export const copyAssetFiles = async (src: string, dest: string) => {
  await fsExtra.copy(src, dest, {
    filter: (targetPath: string) => {
      return isDirectory(targetPath) || isAssetFile(targetPath);
    },
    recursive: true,
  });
};
