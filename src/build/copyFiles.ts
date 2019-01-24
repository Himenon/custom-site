import { BuildOption } from "@custom-site/config";
import * as fsExtra from "fs-extra";
import * as path from "path";
import { appStore } from "../store";

const isDirectory = (src: string) => {
  return fsExtra.existsSync(src) && fsExtra.statSync(src).isDirectory();
};

const isNotBlacklistPattern = (src: string, blacklist: BuildOption["blacklist"]) => {
  return !blacklist.extensions.includes(path.extname(src));
};

export const copyAssetFiles = async () => {
  const config = appStore.getState({ type: "config", id: "" });
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
