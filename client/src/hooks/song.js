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

export const useSongsMutation = (gameId, options) =>
  useMutation(
    ({ playerId, songs }) =>
      axios.post(`/games/${gameId}/songs`, { playerId, songs }),
    options
  );
