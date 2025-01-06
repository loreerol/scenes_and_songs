import express from "express";
import path from "node:path";
import cors from "cors";
import * as crypto from "node:crypto";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();

import { createClient } from "redis";

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/api/games", async (req, res) => {
  let gameId = crypto.randomBytes(5).toString("base64url").toUpperCase();
  while (await client.get(`sns:${gameId}:mod`)) {
    gameId = crypto.randomBytes(5).toString("base64url").toUpperCase();
  }
  const mod = crypto.randomBytes(5).toString("base64url").toUpperCase();

  await client.hSet(`sns:${gameId}:mod`, { name: "", mod });

  res.json({ gameId, modId: mod });
});

// status of the game
app.get("/api/games/:gameId", async (req, res) => {});

app.get("/api/games/:gameId/players", async (req, res) => {});

app.post("/api/games/:gameId/players", async (req, res) => {});

app.get("/api/games/:gameId/scenarios", async (req, res) => {});

app.get("/api/games/:gameId/scenarios/songs", async (req, res) => {});

app.post("/api/games/:gameId/scenarios", async (req, res) => {});

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
