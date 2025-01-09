import { useMutation } from "react-query";

import axios from "../axios";

export const useGuessMutation = (gameId, options) =>
  useMutation(
    ({ playerId, song, guess }) =>
      axios
        .post(`/games/${gameId}/guess`, { playerId, song, guess })
        .then((res) => res.data),
    options
  );
