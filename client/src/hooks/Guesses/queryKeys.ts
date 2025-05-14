export const guessQueryKeys = {
  all: () => ["guesses"],
  game: (gameId: string) => ["guesses", gameId],
};
