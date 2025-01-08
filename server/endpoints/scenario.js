const getScenarios = async (req, res, client) => {
  const gameId = req.params.gameId;
  const scenarios = await client.lRange(`sns:${gameId}:scenarios`, 0, -1);

  if (!scenarios.length) {
    res.json({ exists: false, scenarios: [] });
    return;
  }

  res.json({ exists: true, scenarios });
};

const createScenarios = async (req, res, client) => {
  const gameId = req.params.gameId;
  const scenarios = req.body.scenarios;
  const scenariosKey = `sns:${gameId}:scenarios`;

  const existingScenarios = await client.lRange(scenariosKey, 0, -1);
  if (existingScenarios.length) {
    res.status(400).json({ message: "Scenarios for this game already exist" });
    return;
  }

  await client.lPush(scenariosKey, scenarios);
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
