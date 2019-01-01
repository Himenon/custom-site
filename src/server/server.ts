import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as url from "url";

import * as chokidar from "chokidar";
import * as portfinder from "portfinder";
import * as WebSocket from "ws";

import { DevelopOption } from "@rocu/cli";
import { RenderedStaticPage } from "@rocu/page";
import { generateStatic } from "../generator";
import { getData } from "../getPage";
import { reloadScript } from "./reloadScript";
import { makeWebSocketServer } from "./wsServer";

const OBSERVE_FILE_EXTENSION = /\.(js|css|jsx|md|mdx|json)$/;

export const redirectToLocalFile = (filePath: string, res: http.ServerResponse): boolean => {
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    fs.createReadStream(filePath).pipe(res);
    return true;
  }
  return false;
};

/**
 * GenerateしたPageのkeyにマッチするようなパスに変換
 */
export const getRedirectPagePath = (pathname: string, option: DevelopOption): string => {
  if (option.serverBasePath === "/") {
    return pathname === "/" ? "/index" : pathname;
  }
  if (pathname === "/" || pathname === option.serverBasePath) {
    return path.join(pathname, "index");
  }
  return pathname;
};

/**
 * ローカルディレクトリにあるファイル名を探索できるようなパスに変換
 */
export const getRedirectLocalDirectoryPath = (dirname: string, pathname: string, option: DevelopOption): string => {
  if (pathname.startsWith(option.serverBasePath)) {
    return path.join(dirname, pathname.slice(option.serverBasePath.length));
  }
  return path.join(dirname, pathname);
};

const start = async (dirname: string, option: DevelopOption) => {
  const socketPort: number = await portfinder.getPortPromise();
  const initialSource = await getData(dirname, option);
  let socket: WebSocket;
  let generatedPages = await generateStatic(initialSource, option);

  const watcher: chokidar.FSWatcher = chokidar.watch(dirname, {
    ignoreInitial: true,
  });

  makeWebSocketServer(socketPort, (res: WebSocket) => {
    socket = res;
  });

  const update = async (updateParams: { filename: string }) => {
    if (!socket) {
      return;
    }
    const updatedSource = await getData(dirname, { ...option, watcher: updateParams });
    generatedPages = await generateStatic(updatedSource, option);
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

  const app = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (!req.url) {
      return;
    }
    const { pathname } = url.parse(req.url);
    if (!pathname) {
      return;
    }
    const filePath = path.join(dirname, pathname);
    // そのまま返せるファイルが有る場合は返す
    if (redirectToLocalFile(filePath, res)) {
      return;
    }
    // basepathが存在する場合
    if (redirectToLocalFile(getRedirectLocalDirectoryPath(dirname, pathname, option), res)) {
      return;
    }
    // 返せない場合はGeneratorから生成されたキャッシュを読みに行く
    const name = getRedirectPagePath(pathname, option);
    // tslint:disable:max-line-length
    const renderStaticPage: RenderedStaticPage | undefined = generatedPages.find((page: RenderedStaticPage) => page.name === name);
    if (renderStaticPage) {
      res.write(renderStaticPage.html);
      res.write(reloadScript(socketPort));
      res.end();
      return;
    }

    res.write("page not found: " + name);
    res.end();
    return;
  });

  try {
    const server = await app.listen(socketPort + 2);
    return server;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { start as server };
