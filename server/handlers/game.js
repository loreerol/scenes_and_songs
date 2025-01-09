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

  // get data
  const gameId = msg.gameId;
  const game = await client.hGetAll(`sns:${gameId}`);
  const players = await client.lRange(`sns:${gameId}:players`, 0, -1);

  // change state
  await client.hSet(`sns:${gameId}`, { state: "voting-phase" });

  // set default votes
  const key = `sns:${gameId}:scenario:${game.scenario}:votes`;
  await client.hSet(
    key,
    players.reduce(
      (acc, playerId) =>
        playerId === game.mod ? acc : { ...acc, [playerId]: 0 },
      {}
    )
  );

  // send messages to update clients
  Object.entries(sockets[msg.gameId]).forEach(([playerId, ws]) => {
    if (playerId === game.mod) return;
    ws.send("votingStarted");
  });
};

const closeVoting = async (ws, req, msg, client, sockets) => {
  if (msg.type !== "closeVoting") return;

  if (!msg.gameId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId is required");
    return;
  }

  const gameId = msg.gameId;
  const game = await client.hGetAll(`sns:${gameId}`);
  await client.hSet(`sns:${gameId}`, { state: "voting-phase-results" });

  Object.entries(sockets[gameId]).forEach(([playerId, ws]) => {
    if (playerId === game.mod) return;
    ws.send("showVoteWinners");
  });
};

const startGuessing = async (ws, req, msg, client, sockets) => {
  if (msg.type !== "startGuessing") return;

  if (!msg.gameId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId is required");
    return;
  }

  const gameId = msg.gameId;
  const game = await client.hGetAll(`sns:${gameId}`);
  await client.hSet(`sns:${gameId}`, { state: "guessing-phase" });

  Object.entries(sockets[gameId]).forEach(([playerId, ws]) => {
    if (playerId === game.mod) return;
    ws.send("startGuessing");
  });
};

const closeGuessing = async (ws, req, msg, client, sockets) => {
  if (msg.type !== "closeGuessing") return;

  if (!msg.gameId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId is required");
    return;
  }

  const gameId = msg.gameId;
  await client.hSet(`sns:${gameId}`, { state: "guessing-phase-results" });
};

const showRoundResults = async (ws, req, msg, client, sockets) => {
  if (msg.type !== "showRoundResults") return;

  if (!msg.gameId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId is required");
    return;
  }

  const gameId = msg.gameId;
  const game = await client.hGetAll(`sns:${gameId}`);
  await client.hSet(`sns:${gameId}`, { state: "round-results" });

  Object.entries(sockets[gameId]).forEach(([playerId, ws]) => {
    if (playerId === game.mod) return;
    ws.send("showRoundResults");
  });
};

const endRound = async (ws, req, msg, client, sockets) => {
  if (msg.type !== "endRound") return;

  if (!msg.gameId) {
    console.error("Invalid JSON", msg);
    ws.send("Error: gameId is required");
    return;
  }

  const gameId = msg.gameId;
  const game = await client.hGetAll(`sns:${gameId}`);
  const scenarios = await client.lRange(`sns:${gameId}:scenarios`, 0, -1);

  const newScenario = game.scenario + 1;
  if (newScenario >= scenarios.length) {
    await client.hSet(`sns:${gameId}`, { state: "game-over" });
    Object.entries(sockets[gameId]).forEach(([playerId, ws]) => {
      ws.send("gameOver");
    });
    return;
  }

  await client.hSet(`sns:${gameId}`, {
    scenario: newScenario,
    state: "music-phase",
  });

  Object.entries(sockets[gameId]).forEach(([playerId, ws]) => {
    if (playerId === game.mod) return;
    ws.send("startNextRound");
  });
};

export default [
  startGame,
  startVoting,
  closeVoting,
  startGuessing,
  closeGuessing,
  showRoundResults,
  endRound,
];
