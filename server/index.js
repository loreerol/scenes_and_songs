import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createClient } from "redis";

import gameEndpoints from "./endpoints/game.js";
import playerEndpoints from "./endpoints/player.js";
import scenarioEndpoints from "./endpoints/scenario.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());

var jsonParser = bodyParser.json();

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
// TODO: await client.disconnect();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const registerEndpoint = ({ method, path, handler }) => {
  if (method === "get") {
    app.get(path, async (req, res) => handler(req, res, client));
  } else if (method === "post") {
    app.post(path, jsonParser, async (req, res) => handler(req, res, client));
  }
};

gameEndpoints.forEach(registerEndpoint);
playerEndpoints.forEach(registerEndpoint);
scenarioEndpoints.forEach(registerEndpoint);

// status of the game
app.get("/api/games/:gameId", async (req, res) => {
  console.log("TODO");
});

app.get("/api/games/:gameId/scenarios/songs", async (req, res) => {
  console.log("TODO");
});

// app.get("/api/games/:gameId/songs", async (req, res) => {});

// app.post("/api/games/:gameId/songs", async (req, res) => {});
// // data: player id and songs

// app.post("/api/games/:gameId/vote", async (req, res) => {});
// // data: player id and scenario and vote

// app.get("/api/games/:gameId/:scenario/scenario-winner", async (req, res) => {});

// app.post("/api/games/:gameId/:playerId/guess", async (req, res) => {});

// app.get("/api/games/:gameId/results", async (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
