import axios from "../../axios";
import { Game, GameScore } from "../../types/gameTypes";

export interface GameCreationPayload {
  name: string;
}

export const fetchGameState = async (gameId: string): Promise<Game> => {
  const response = await axios.get<Game>(`games/${gameId}/state`);
  return response.data;
};

export const fetchGameScore = async (gameId: string): Promise<GameScore> => {
  const response = await axios.get<{ scores: GameScore }>(
    `games/${gameId}/scores`,
  );
  return response.data.scores;
};

export const createGame = async (): Promise<any> => {
  const response = await axios.post("/games");
  return response.data;
};
