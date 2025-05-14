import axios from "../../axios";
import { Player } from "../../types/gameTypes";

export interface PlayerCreationPayload {
  name: string;
}

export const fetchPlayers = (gameId: string) =>
  axios
    .get<{ players: Player[] }>(`games/${gameId}/players/`)
    .then((res) => res.data.players);

export const createPlayer = async (
  gameId: string,
  payload: PlayerCreationPayload,
) => {
  const response = await axios.post(`games/${gameId}/players/`, payload);
  return response.data;
};
