import { useMutation, useQuery } from "@tanstack/react-query";
import { gameQueryKeys } from "./queryKeys";
import { createGame, fetchGameScore, fetchGameState } from "./services";
import { Game, GameScore } from "../../types/gameTypes";

export const useGameState = (gameId: string) =>
  useQuery<Game>({
    queryKey: gameQueryKeys.gameState(gameId),
    queryFn: () => fetchGameState(gameId),
    enabled: Boolean(gameId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useGameScore = (gameId: string) =>
  useQuery<GameScore>({
    queryKey: gameQueryKeys.gameScore(gameId),
    queryFn: () => fetchGameScore(gameId),
    enabled: Boolean(gameId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useCreateGameMutation = (options?: any) =>
  useMutation({ mutationKey: "createGame", mutationFn: createGame, ...options });
