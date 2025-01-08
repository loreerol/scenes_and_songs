import { useQuery, useMutation } from "react-query";

import axios from "../axios";

export const usePlayer = (gameId, playerId) =>
  useQuery(
    ["playerName"],
    () =>
      axios.get(`games/${gameId}/players/${playerId}`).then((res) => res.data),
    {
      enabled: Boolean(gameId && playerId),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

export const usePlayerJoinMutation = (gameId, options) =>
  useMutation(
    ({ name }) =>
      axios.post(`/games/${gameId}/players`, { name }).then((res) => res.data),
    options
  );
