import { BuildOption } from "@custom-site/config";
import * as fsExtra from "fs-extra";
import * as path from "path";
import { app } from "../store";

const isDirectory = (src: string) => {
  return fsExtra.existsSync(src) && fsExtra.statSync(src).isDirectory();
};

const isNotBlacklistPattern = (src: string, blacklist: BuildOption["blacklist"]) => {
  return !blacklist.extensions.includes(path.extname(src));
};

export const copyAssetFiles = async () => {
  const config = app.get({ type: "config", id: "" });
  if (!config || !config.source || !config.destination) {
    return;
  }
  await fsExtra.copy(config.source, config.destination, {
    filter: (targetPath: string) => {
      return isDirectory(targetPath) || isNotBlacklistPattern(targetPath, config.blacklist);
    },
    recursive: true,
  });
};

export const copyNodeModulesLibs = async () => {
  const config = app.get({ type: "config", id: "" });
  if (!config || !config.global.css || !config.destination) {
    return;
  }
  const startList = ["node_modules", "./node_modules", "../node_modules"];
  const cssFiles = config.global.css.map(target => {
    if (typeof target === "string") {
      return target;
    }
    return target.href ? target.href : "";
  });
  const files = cssFiles.filter(item => {
    return startList.map(t => item.startsWith(t)).includes(true);
  });
  const dest = path.join(config.destination, "lib");
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
