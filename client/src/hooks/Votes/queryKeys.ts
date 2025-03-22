export const voteQueryKeys = {
  all: () => ["votes"],
  game: (gameId: string) => ["votes", gameId],
};
