import { useMutation, useQuery } from "react-query";

import axios from "../axios";

export const useGuesses = (gameId, gameState) =>
  useQuery(
    ["guesses"],
    () => axios.get(`games/${gameId}/guess`).then((res) => res.data.guesses),
    {
      enabled:
        Boolean(gameId) && Boolean(gameState) && gameState === "guessing-phase",
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const useGuessMutation = (gameId, options) =>
  useMutation(
    ({ playerId, guess }) =>
      axios
        .post(`/games/${gameId}/guess`, { playerId, guess })
        .then((res) => res.data),
    options
  );
