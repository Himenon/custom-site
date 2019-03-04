import * as WebSocket from "ws";

export const makeWebSocketServer = (socketPort: number, setSocket: (res: WebSocket) => void) => {
  const socketServer = new WebSocket.Server({ port: socketPort });

  socketServer.on("connection", (res: WebSocket) => {
    setSocket(res);
  });

  socketServer.on("error", (err: any) => {
    console.error("connection error:", JSON.stringify(err));
  });

  socketServer.on("close", (_res: WebSocket) => {
    console.info("connection closed");
  });
  return socketServer;
};
