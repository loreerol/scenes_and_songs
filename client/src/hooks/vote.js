import { useMutation } from "react-query";

import axios from "../axios";

export const useVoteMutation = (gameId, options) =>
  useMutation(({ playerId, scenario, song }) => {
    axios
      .post(`/games/${gameId}/votes`, { playerId, scenario, song })
      .then((res) => res.data)
      .catch((err) => console.error(err));
  }, options);
