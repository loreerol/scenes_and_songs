import React, { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import axios from "../axios";

export const GameContext = createContext({
  gameId: null,
  playerId: null,
  isMod: false,
  setGameCookie: () => {},
});

export const GameProvider = ({ children }) => {
  const gameId = window.location.pathname.split("/")[2];
  const [cookies, setCookie, removeCookie] = useCookies(["sns-game"]);

  const [state, setState] = useState({
    playerId: cookies["sns-game"]?.playerId || null,
    isMod: cookies["sns-game"]?.isMod || false,
  });

  const { playerId, isMod } = state;

  useEffect(() => {
    setState({
      playerId: cookies["sns-game"]?.playerId || null,
      isMod: cookies["sns-game"]?.isMod || false,
    });
  }, [cookies]);

  const setGameCookie = ({ gameId, playerId, isMod }) => {
    setCookie("sns-game", { gameId, playerId, isMod });
    setState({ playerId, isMod });
  };

  const { data: playerData } = useQuery(
    ["playerName", playerId],
    () =>
      axios.get(`games/${gameId}/players/${playerId}`).then((res) => res.data),
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
