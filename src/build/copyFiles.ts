import * as fsExtra from "fs-extra";
import * as path from "path";

const ASSET_EXTENSIONS = [".css", ".js", ".png", ".jpeg", ".jpg", ".gif"];

const isDirectory = (src: string) => {
  return fsExtra.existsSync(src) && fsExtra.statSync(src).isDirectory();
};

const isAssetFile = (src: string) => {
  return ASSET_EXTENSIONS.includes(path.extname(src));
};

export const copyAssetFiles = async (src: string, dest: string) => {
  await fsExtra.copy(src, dest, {
    filter: (targetPath: string) => {
      return isDirectory(targetPath) || isAssetFile(targetPath);
    },
    recursive: true,
  });
};
