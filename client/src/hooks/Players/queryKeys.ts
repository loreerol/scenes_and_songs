export const playersQueryKeys = {
  all: () => ["players"],
  game: (gameId: string) => ["players", gameId],
};
