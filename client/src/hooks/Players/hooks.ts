import { useQuery, useMutation } from "@tanstack/react-query";
import { playersQueryKeys } from "./queryKeys";
import { fetchPlayers, createPlayer, PlayerCreationPayload } from "./services";
import { Player } from "../../types/gameTypes";

export const useFetchPlayers = (gameId: string) =>
  useQuery<Player[]>({
    queryKey: playersQueryKeys.game(gameId),
    queryFn: () => fetchPlayers(gameId),
    enabled: Boolean(gameId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const usePlayerJoinMutation = (gameId: string, options?: any) =>
  useMutation<void, unknown, PlayerCreationPayload>({
    mutationFn: (payload: PlayerCreationPayload) => createPlayer(gameId, payload),
    ...options,
  });
