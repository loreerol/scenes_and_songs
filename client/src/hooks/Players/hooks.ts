import { useQuery, useMutation } from "react-query";
import { playersQueryKeys } from "./queryKeys";
import { fetchPlayers, createPlayer, PlayerCreationPayload } from "./services";

export const useFetchPlayers = (gameId: string) =>
  useQuery(playersQueryKeys.game(gameId), () => fetchPlayers(gameId), {
    enabled: Boolean(gameId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const usePlayerJoinMutation = (gameId: string, options?: any) =>
  useMutation<void, unknown, PlayerCreationPayload>(
    (payload: PlayerCreationPayload) => createPlayer(gameId, payload),
    options,
  );
