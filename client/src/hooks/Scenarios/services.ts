import axios from "../../axios";

export interface ScenarioPayload {
  scenarios: string[];
}

export const fetchScenarios = async (gameId: string) => {
  const response = await axios.get(`games/${gameId}/scenarios/`);
  return response.data.scenarios;
};

export const updateScenarios = async (
  gameId: string,
  payload: ScenarioPayload,
) => {
  const response = await axios.post(`games/${gameId}/scenarios/`, payload);
  return response.data;
};
