const getScenarios = async (req, res, client) => {
  const gameId = req.params.gameId;

  const scenarios = await client.lRange(`sns:${gameId}:scenarios`, 0, -1);

  if (!scenarios.length) {
    console.warn(`No scenarios found for game ${gameId}, returning empty array.`);
    return res.status(200).json({ scenarios: [] }); 
  }

  res.json({ scenarios });
};

const createScenarios = async (req, res, client, sockets) => {
  const gameId = req.params.gameId;
  const scenarios = req.body.scenarios;
  const scenariosKey = `sns:${gameId}:scenarios`;

  const existingScenarios = await client.lRange(scenariosKey, 0, -1);
  if (existingScenarios.length) {
    res.status(400).json({ message: "Scenarios for this game already exist" });
    return;
  }

  await client.rPush(scenariosKey, scenarios);
  await client.hSet(`sns:${gameId}`, { state: "song-selection" });
  const mod = await client.hGet(`sns:${gameId}`, "mod");

  Object.entries(sockets[gameId]).forEach(([playerId, ws]) => {
    if (playerId === mod) return;
    ws.send("senariosCreated");
  });

  res.json({ scenarios });
};

export default [
  {
    method: "get",
    path: "/api/games/:gameId/scenarios",
    handler: getScenarios,
  },
  {
    method: "post",
    path: "/api/games/:gameId/scenarios",
    handler: createScenarios,
  },
];
