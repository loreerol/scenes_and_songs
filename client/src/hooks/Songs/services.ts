import axios from "../../axios";
import { Songs, SongEntry } from "../../types/gameTypes";

export const fetchSongs = async (gameId: string): Promise<Songs> => {
  const response = await axios.get<{ songs: Songs }>(`games/${gameId}/songs`);
  return response.data.songs;
};

export const fetchWinningSongs = async (gameId: string): Promise<string[]> => {
  const response = await axios.get<{ winningSongs: string[] }>(
    `games/${gameId}/songs/winning`,
  );
  return response.data.winningSongs;
};

export const submitSongs = async (
  gameId: string,
  playerId: string,
  songs: SongEntry[],
) => {
  return axios.post(`/games/${gameId}/songs`, { playerId, songs });
};
