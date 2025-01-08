const startGame = async (ws, req, msg, client, sockets) => {
  if (msg.type !== "startGame") return;

  if (!msg.gameId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId is required");
    return;
  }

  await client.hSet(`sns:${msg.gameId}`, { state: "music-phase", scenario: 0 });

  Object.entries(sockets[msg.gameId]).forEach(([_, ws]) => {
    ws.send("gameStarted");
  });
};

const startVoting = async (ws, req, msg, client, sockets) => {
  if (msg.type !== "startVoting") return;

  if (!msg.gameId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId is required");
    return;
  }

  await client.hSet(`sns:${msg.gameId}`, { state: "voting-phase" });

  const mod = await client.hGet(`sns:${msg.gameId}`, "mod");
  Object.entries(sockets[msg.gameId]).forEach(([playerId, ws]) => {
    if (playerId === mod) return;
    ws.send("votingStarted");
  });
};

export default [startGame, startVoting];
