import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import expressWs from "express-ws";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "redis";

import playerHandlers from "./handlers/player.js";
import gameHandlers from "./handlers/game.js";

import gameEndpoints from "./endpoints/game.js";
import playerEndpoints from "./endpoints/player.js";
import scenarioEndpoints from "./endpoints/scenario.js";
import songEndpoints from "./endpoints/song.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();
expressWs(app);
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());

var jsonParser = bodyParser.json();

// DB connection
const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
// TODO: await client.disconnect();

// Websockets ---------------------------------------------------------------
// TODO: concurency clobering issues???
const sockets = {};
app.ws("/ws/player", (ws, req) => {
  ws.on("message", (msg) => {
    try {
      msg = JSON.parse(msg);
    } catch (e) {
      console.error("Invalid JSON", msg);
      ws.send("Error: Invalid JSON");
      return;
    }

    if (!msg.type) {
      console.error("Invalid JSON", msg);
      ws.send("Error: type is required");
      return;
    }

    const registerHandler = (handler) => handler(ws, req, msg, client, sockets);

    playerHandlers.forEach(registerHandler);
    gameHandlers.forEach(registerHandler);

    ws.send("Success");
  });
});

// API ---------------------------------------------------------------------
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const registerEndpoint = ({ method, path, handler }) => {
  if (method === "get") {
    app.get(path, async (req, res) => await handler(req, res, client, sockets));
  } else if (method === "post") {
    app.post(path, jsonParser, async (req, res) => {
      await handler(req, res, client, sockets);
    });
  }
};

gameEndpoints.forEach(registerEndpoint);
playerEndpoints.forEach(registerEndpoint);
scenarioEndpoints.forEach(registerEndpoint);
songEndpoints.forEach(registerEndpoint);

// app.post("/api/games/:gameId/vote", async (req, res) => {});
// // data: player id and scenario and vote

// app.get("/api/games/:gameId/:scenario/scenario-winner", async (req, res) => {});

// app.post("/api/games/:gameId/:playerId/guess", async (req, res) => {});

// app.get("/api/games/:gameId/results", async (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
