import { useQuery, useMutation } from "react-query";

import axios from "../axios";

export const useVotes = (gameId, gameState) =>
  useQuery(
    ["votes"],
    () => axios.get(`games/${gameId}/votes`).then((res) => res.data.votes),
    {
      enabled:
        Boolean(gameId) && Boolean(gameState) && gameState === "voting-phase",
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const useVoteMutation = (gameId, options) =>
  useMutation(
    ({ playerId, scenario, song }) =>
      axios
        .post(`/games/${gameId}/votes`, { playerId, scenario, song })
        .then((res) => res.data),
    options
  );
