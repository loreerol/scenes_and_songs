import { useMutation } from "react-query";

import axios from "../axios";

export const useGuessMutation = (gameId, options) =>
  useMutation(
    ({ playerId, guess }) =>
      axios
        .post(`/games/${gameId}/guess`, { playerId, guess })
        .then((res) => res.data),
    options
  );
