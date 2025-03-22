import { useQuery, useMutation } from "react-query";
import { scenariosQueryKeys } from "./queryKeys";
import { fetchScenarios, updateScenarios, ScenarioPayload } from "./services";

export const useFetchScenarios = (gameId: string, gameState: string) => {
  return useQuery(
    scenariosQueryKeys.game(gameId),
    () => fetchScenarios(gameId),
    {
      enabled: true,
      // enabled: Boolean(gameId) && Boolean(gameState) && gameState === "lobby" ,
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  );
};

export const useScenariosMutation = (gameId: string, options?: any) =>
  useMutation<void, unknown, ScenarioPayload>(
    (payload: ScenarioPayload) => updateScenarios(gameId, payload),
    options,
  );
