import { useQuery, useMutation } from "react-query";

import axios from "../axios";

export const useSongs = (gameId, gameState) =>
  useQuery(
    ["songs"],
    () => axios.get(`games/${gameId}/songs`).then((res) => res.data.songs),
    {
      enabled: Boolean(gameId) && Boolean(gameState) && gameState !== "lobby",
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const useWinningSongs = (gameId, gameState) =>
  useQuery(
    ["winningSongs"],
    () =>
      axios
        .get(`games/${gameId}/songs/winning`)
        .then((res) => res.data.winningSongs),
    {
      enabled:
        Boolean(gameId) &&
        ["voting-phase-results", "guessing-phase"].includes(gameState),
    }
  );

export const useSongsMutation = (gameId, options) =>
  useMutation(
    ({ playerId, songs }) =>
      axios.post(`/games/${gameId}/songs`, { playerId, songs }),
    options
  );
