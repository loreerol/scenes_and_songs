export const songQueryKeys = {
  all: () => ["songs"],
  game: (gameId: string) => ["songs", gameId],
  winning: (gameId: string) => ["winningSongs", gameId],
};
