import * as fsExtra from "fs-extra";
import * as path from "path";

const isDirectory = (src: string) => {
  return fsExtra.existsSync(src) && fsExtra.statSync(src).isDirectory();
};

const isNotBlacklistPattern = (src: string, extensions: string[]) => {
  return !extensions.includes(path.extname(src));
};

export const copyAssetFiles = async (source: string, destination: string, extensions: string[] = []) => {
  await fsExtra.copy(source, destination, {
    filter: (targetPath: string) => {
      return isDirectory(targetPath) || isNotBlacklistPattern(targetPath, extensions);
    },
    recursive: true,
  });
};

export const copyNodeModulesLibs = async (files: string[], destination: string, outputLibPath: string) => {
  const dest = path.join(destination, outputLibPath);
  const promises = files.map(async (filename: string) => {
    if (!fsExtra.existsSync(filename) || !fsExtra.statSync(filename).isFile()) {
      return Promise.resolve();
    }
    const destFile = path.join(dest, path.basename(filename));
    const destDir = path.dirname(destFile);
    if (!fsExtra.existsSync(destDir) || !fsExtra.statSync(destDir).isDirectory()) {
      console.log(`MKDIR :, ${destDir}`);
      fsExtra.mkdirSync(path.dirname(destFile), { recursive: true });
    }
    console.log(`COPY  : ${filename} -> ${destFile}`);
    return fsExtra.copy(filename, destFile);
  });
  await Promise.all(promises);
};
