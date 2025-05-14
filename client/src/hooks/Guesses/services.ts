import axios from "../../axios";
import { Guess } from "../../types/gameTypes";

export const fetchGuesses = async (gameId: string): Promise<Guess[]> => {
  const response = await axios.get<{ guesses: Guess[] }>(
    `games/${gameId}/guess`,
  );
  return response.data.guesses;
};

export const submitGuess = async (
  gameId: string,
  guessData: { playerId: string; song: string; guess: string },
) => {
  const response = await axios.post(`/games/${gameId}/guess`, guessData);
  return response.data;
};
