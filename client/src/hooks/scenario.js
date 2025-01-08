import { useQuery, useMutation } from "react-query";

import axios from "../axios";

export const useScenarios = (gameId, gameState) =>
  useQuery(
    ["scenarios"],
    () =>
      axios.get(`games/${gameId}/scenarios`).then((res) => res.data.scenarios),
    {
      enabled: Boolean(gameId) && Boolean(gameState) && gameState !== "lobby",
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const useScenariosMutation = (gameId, options) =>
  useMutation(
    ({ scenarios }) => axios.post(`/games/${gameId}/scenarios`, { scenarios }),
    options
  );
