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
        [
          "voting-phase-results",
          "guessing-phase",
          "guessing-phase-results",
        ].includes(gameState),
    }
  );

export const useRandomSongOrder = (gameId, gameState) =>
  useQuery(
    ["randomSongOrder"],
    () =>
      axios
        .get(`games/${gameId}/songs/random`)
        .then((res) => res.data.randomSongOrder),
    {
      enabled: Boolean(gameId) && Boolean(gameState) && gameState !== "lobby",
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const useSongsMutation = (gameId, options) =>
  useMutation(
    ({ playerId, songs }) =>
      axios.post(`/games/${gameId}/songs`, { playerId, songs }),
    options
  );

export const useRandomSongOrderMutation = (gameId, options) =>
  useMutation(() => axios.post(`/games/${gameId}/songs/random`), options);
