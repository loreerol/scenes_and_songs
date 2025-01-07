import React, { createContext } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import axios from "../axios";

export const GameContext = createContext({
  gameId: null,
  playerId: null,
  // playerName: null,
  isMod: false,
  setGameCookie: () => {},
});

export const GameProvider = ({ children }) => {
  const gameId = window.location.pathname.split("/")[2];
  const [cookies, setCookie, removeCookie] = useCookies(["sns-game"]);
  const cookie = cookies["sns-game"];

  let playerId = cookie ? cookie.playerId : null;
  let isMod = cookie ? cookie.isMod : false;

  if (gameId && gameId !== cookie?.gameId) {
    removeCookie("sns-game");
    setCookie("sns-game", { gameId, playerId: null, isMod: false });
    playerId = null;
    isMod = false;
  }

  const setGameCookie = ({ gameId, playerId, isMod }) => {
    setCookie("sns-game", { gameId, playerId, isMod });
  };

  const { data: playerData } = useQuery(
    ["playerName", playerId],
    () =>
      axios.get(`games/${gameId}/players/${playerId}`).then((res) => {
        console.log("GameProvider", res.data);
        return res.data;
      }),
    {
      enabled: Boolean(gameId && playerId),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  console.info("GameProvider", { gameId, playerId, playerData, isMod });

  return (
    <GameContext.Provider
      value={{
        gameId,
        playerId,
        playerName: playerData?.name,
        isMod,
        setGameCookie,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
