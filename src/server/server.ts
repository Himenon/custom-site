import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as url from "url";

import * as chokidar from "chokidar";
import * as portfinder from "portfinder";
import * as WebSocket from "ws";

import { Options } from "@rocu/cli";
import { RenderedStaticPage } from "@rocu/page";
import { generateStatic } from "../generator";
import { getData } from "../structure/getPage";
import { reloadScript } from "./reloadScript";
import { makeWebSocketServer } from "./wsServer";

const start = async (dirname: string, opts: Options) => {
  const socketPort: number = await portfinder.getPortPromise();

  const initialSource = await getData(dirname, opts);
  let socket: WebSocket;
  let gPages = await generateStatic(initialSource, opts);

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
    const updatedSource = await getData(dirname, { ...opts, watcher: updateParams });
    gPages = await generateStatic(updatedSource, opts);
    socket.send(JSON.stringify({ reload: true }));
  };

  watcher.on("change", async (filename: string) => {
    const base = path.basename(filename);
    const ext = path.extname(base);
    if (!/\.(jsx|md|mdx|json)$/.test(ext)) {
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
    // serve local images and files
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const name = pathname === "/" ? "index" : pathname.replace(/^\//, "").replace(/\/$/, "");
    // tslint:disable:max-line-length
    const renderStaticPage: RenderedStaticPage | undefined = gPages.find((targetPage: RenderedStaticPage) => targetPage.name === name);

    if (!renderStaticPage) {
      res.write("page not found: " + pathname);
      res.end();
      return;
    }
    res.write(renderStaticPage.html);
    res.write(reloadScript(socketPort));
    res.end();
  });

  try {
    const server = await app.listen(socketPort + 2);
    return server;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { start as server };
