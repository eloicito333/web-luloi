import dotenv from "dotenv"

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";
//import morgan from "morgan";
import { chatSocketInit } from "./sockets/chat/chatSocket.mjs";

dotenv.config()
console.log( process.env.NEXT_PUBLIC_PROJECT_ID)

const port = process.env.PORT || 3000;
const hostname = process.env.HTTP_URL || process.env.VERCEL_URL || "localhost"
const dev = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  //server.use(morgan(!dev ? "combined" : "dev"))
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  chatSocketInit(io)

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on ${ process.env?.VERCEL_URL || `http://${hostname}:${port}`}`);
    });
});
