import { useMutation, useQuery } from "react-query";
import { gameQueryKeys } from "./queryKeys";
import { createGame, fetchGameScore, fetchGameState } from "./services";
import { Game, GameScore } from "../../types/gameTypes";

export const useGameState = (gameId: string) =>
  useQuery<Game>(
    gameQueryKeys.gameState(gameId),
    () => fetchGameState(gameId),
    {
      enabled: Boolean(gameId),
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  );

export const useGameScore = (gameId: string) =>
  useQuery<GameScore>(
    gameQueryKeys.gameScore(gameId),
    () => fetchGameScore(gameId),
    {
      enabled: Boolean(gameId),
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  );

export const useCreateGameMutation = (options?: any) =>
  useMutation(createGame, options);
