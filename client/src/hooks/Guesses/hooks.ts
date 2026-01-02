import { useMutation, useQuery } from "@tanstack/react-query";
import { Guess } from "../../types/gameTypes";
import { guessQueryKeys } from "./queryKeys";
import { fetchGuesses, submitGuess } from "./services";

export const useGuesses = (gameId: string, gameState: string) =>
  useQuery<Guess[]>({
    queryKey: guessQueryKeys.game(gameId),
    queryFn: () => fetchGuesses(gameId),
    enabled: Boolean(gameId) && gameState === "guessing-phase",
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const useGuessMutation = (gameId: string, options?: any) =>
  useMutation({
    mutationKey: "submitGuess",
    mutationFn: (guessData: { playerId: string; song: string; guess: string }) =>
      submitGuess(gameId, guessData),
    ...options,
  });
