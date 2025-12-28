import { useQuery, useMutation } from "@tanstack/react-query";
import { scenariosQueryKeys } from "./queryKeys";
import { fetchScenarios, updateScenarios, ScenarioPayload } from "./services";

export const useFetchScenarios = (gameId: string, gameState: string) => {
  return useQuery<string[]>({
    queryKey: scenariosQueryKeys.game(gameId),
    queryFn: () => fetchScenarios(gameId),
    enabled: true,
    // enabled: Boolean(gameId) && Boolean(gameState) && gameState === "lobby" ,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useScenariosMutation = (gameId: string, options?: any) =>
  useMutation<void, unknown, ScenarioPayload>({
    mutationFn: (payload: ScenarioPayload) => updateScenarios(gameId, payload),
    ...options,
  });
