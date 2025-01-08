const registerPlayer = async (ws, req, msg, client, sockets) => {
  if (msg.type !== "register") return;

  if (!msg.gameId || !msg.playerId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId and playerId are required");
    return;
  }

  if (!sockets[msg.gameId]) {
    client.hGet(`sns:${msg.gameId}`, "mod").then((mod) => {
      if (mod) {
        sockets[msg.gameId] = {};
        sockets[msg.gameId][msg.playerId] = ws;
      } else {
        ws.send("Error: Game not found");
      }
    });
  } else {
    sockets[msg.gameId][msg.playerId] = ws;
  }
};

export default [registerPlayer];
