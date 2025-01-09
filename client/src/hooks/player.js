import { useQuery, useMutation } from "react-query";

import axios from "../axios";

export const usePlayers = (gameId) =>
  useQuery(
    ["players"],
    () => axios.get(`games/${gameId}/players`).then((res) => res.data.players),
    {
      enabled: Boolean(gameId),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const usePlayerJoinMutation = (gameId, options) =>
  useMutation(
    ({ name }) =>
      axios.post(`/games/${gameId}/players`, { name }).then((res) => res.data),
    options
  );
