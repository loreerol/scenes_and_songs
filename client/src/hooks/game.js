import { useQuery, useMutation } from "react-query";

import axios from "../axios";

export const useGameState = (gameId) =>
  useQuery(
    ["gameState"],
    () => axios.get(`games/${gameId}/state`).then((res) => res.data),
    {
      enabled: Boolean(gameId),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const useGameScores = (gameId) =>
  useQuery(
    ["gameScores"],
    () => axios.get(`games/${gameId}/scores`).then((res) => res.data.scores),
    {
      enabled: Boolean(gameId),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const useCreateGameMutation = (options) =>
  useMutation(() => axios.post("/games").then((res) => res.data), options);
