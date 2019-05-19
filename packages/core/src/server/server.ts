import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as url from "url";

import * as chokidar from "chokidar";
import * as portfinder from "portfinder";
import * as WebSocket from "ws";

import { DevelopOption } from "@custom-site/interfaces";
import { RenderedStaticPage } from "@custom-site/interfaces/lib/page";
import { lookup } from "mime-types";
import { generateSiteState } from "../generateProps";
import { generateStatic } from "../generator";
import { getPages } from "../getPage";
import { getDefaultConfig } from "../helpers";
import { appCommandService, appQueryService, init, initPlugins, pluginEventEmitter } from "../lifeCycle";
import { getPluginPath } from "../resolver/index";
import { reloadScript } from "./reloadScript";
import { makeWebSocketServer } from "./wsServer";

const OBSERVE_FILE_EXTENSION = /\.(js|css|jsx|md|mdx|json)$/;

export const redirectToLocalFile = (filePath: string, res: http.ServerResponse): boolean => {
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    console.log(`LOAD : ${filePath}`);
    res.writeHead(200, { "Content-Type": lookup(filePath) || "text/plain" });
    fs.createReadStream(filePath).pipe(res);
    return true;
  }
  return false;
};

/**
 * GenerateしたPageのkeyにマッチするようなパスに変換
 */
export const getRedirectPagePath = (pathname: string, option: DevelopOption): string => {
  const calcPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, pathname.length - 1) : pathname;
  if (option.baseUri === "/") {
    return calcPath === "/" ? "/index" : calcPath;
  }
  if (calcPath === "/" || calcPath === option.baseUri) {
    return path.join(calcPath, "index");
  }
  return calcPath;
};

/**
 * ローカルディレクトリにあるファイル名を探索できるようなパスに変換
 */
export const getRedirectLocalDirectoryPath = (dirname: string, pathname: string, option: DevelopOption): string => {
  if (pathname.startsWith(option.baseUri)) {
    return path.join(dirname, pathname.slice(option.baseUri.length));
  }
  return path.join(dirname, pathname);
};

const start = async (option: DevelopOption) => {
  init(option);
  let config: DevelopOption = { ...(appQueryService.getConfig() || option), __type: "DEVELOPMENT" };
  const socketPort: number = await portfinder.getPortPromise({
    port: config.port - 2,
  });
  const initPages = await getPages(config);
  let socket: WebSocket;
  let renderedPages = await generateStatic(generateSiteState(config), initPages);

  const loadedPluginPaths = appQueryService.getPluginPaths();
  const requiredPaths = [config.layoutFile || "", config.customComponentsFile || ""];
  const watchFiles: string[] = [config.source, ...requiredPaths, ...loadedPluginPaths];

  const watcher: chokidar.FSWatcher = chokidar.watch(watchFiles, {
    ignoreInitial: true,
  });

  makeWebSocketServer(socketPort, (res: WebSocket) => {
    socket = res;
  });

  const update = async (updateParams: { filename: string }) => {
    if (!socket) {
      return;
    }
    console.log(`Update: ${updateParams.filename}`);
    // TODO Side Effectを解消する
    if (config.configFile === updateParams.filename) {
      const updateConfig = getDefaultConfig(config.configFile);
      const state = { ...config, ...updateConfig };
      appCommandService.saveConfig(state);
      init(state);
    }
    if (requiredPaths.includes(updateParams.filename)) {
      const externalPath = getPluginPath(updateParams.filename, process.cwd());
      console.log(externalPath);
      if (externalPath) {
        delete require.cache[externalPath];
      }
    }
    if (loadedPluginPaths.includes(updateParams.filename)) {
      console.log("reload plugins");
      loadedPluginPaths.forEach(pluginPath => delete require.cache[pluginPath]);
      pluginEventEmitter.clearAll();
      initPlugins();
    }
    config = { ...(appQueryService.getConfig() || config), __type: "DEVELOPMENT" };
    const newConfig = { ...config, watcher: updateParams };
    const newPages = await getPages(newConfig);
    renderedPages = await generateStatic(generateSiteState(config), newPages);
    socket.send(JSON.stringify({ reload: true }));
  };

  watcher.on("change", async (filename: string) => {
    const base = path.basename(filename);
    const ext = path.extname(base);
    if (!OBSERVE_FILE_EXTENSION.test(ext)) {
      return;
    }
    // todo: handle this per file
    await update({ filename });
  });

  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (!req.url) {
      return;
    }
    console.log(`\nGET  : ${req.url}`);
    const { pathname } = url.parse(req.url);
    if (!pathname) {
      return;
    }
    const filePath = path.join(config.source, pathname);
    // そのまま返せるファイルが有る場合は返す
    if (redirectToLocalFile(filePath, res)) {
      return;
    }
    // ローカルディレクトリに返せるファイルがある場合
    if (redirectToLocalFile(getRedirectLocalDirectoryPath(config.source, pathname, config), res)) {
      return;
    }
    // 返せない場合はGeneratorから生成されたキャッシュを読みに行く
    const name = getRedirectPagePath(pathname, config);
    // tslint:disable:max-line-length
    const renderStaticPage: RenderedStaticPage | undefined = renderedPages.find((page: RenderedStaticPage) => page.name === name);
    if (renderStaticPage) {
      res.write(renderStaticPage.html);
      res.write(reloadScript(socketPort));
      res.end();
      return;
    }
    // サーバー外のファイルを見る場合
    if (redirectToLocalFile(path.relative(config.baseUri, pathname), res)) {
      return;
    }

    res.statusCode = 404;
    res.write("page not found: " + name);
    res.end();
    return;
  });

  try {
    return await server.listen(socketPort + 2);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { start as server };
