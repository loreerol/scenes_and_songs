const startGame = (ws, req, msg, client, sockets) => {
  if (msg.type !== "start-game") return;

  if (!msg.gameId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId is required");
    return;
  }

  client.hSet(`sns:${msg.gameId}`, { state: "music-phase", scenario: 0 });

  Object.entries(sockets[msg.gameId]).forEach(([_, ws]) => {
    ws.send("gameStarted");
  });
};

export default [startGame];
