import React, { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";

import {
  useGameState,
  useGuesses,
  usePlayers,
  useScenarios,
  useSongs,
  useVotes,
  useWinningSongs,
} from "../hooks";
import messageHandlers from "./messageHandlers";
import Layout from "../Layout";

const socketUrl = "ws://localhost:3001/ws/player";

export const GameContext = createContext({
  gameId: null,
  playerId: null,
  isMod: false,
  setGameCookie: () => {},
});

export const GameProvider = ({ children }) => {
  const gameId = window.location.pathname.split("/")[2];
  const navigate = useNavigate();
  // cookies
  const [cookies, setCookie] = useCookies(["sns-game"]);
  const cookie = cookies["sns-game"];

  const [player, setPlayer] = useState({
    playerId: cookie?.playerId || null,
    isMod: cookie?.isMod || false,
  });
  const { playerId, isMod } = player;

  useEffect(() => {
    if (gameId !== cookie?.gameId) {
      setCookie("sns-game", { gameId, playerId: null, isMod: false });
    }
  }, [gameId]);

  useEffect(() => {
    setPlayer({
      playerId: cookie?.playerId || null,
      isMod: cookie?.isMod || false,
    });
  }, [cookies]);

  const setGameCookie = ({ gameId, playerId, isMod }) => {
    setCookie("sns-game", { gameId, playerId, isMod });
    setPlayer({ playerId, isMod });
  };

  // websockets
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (gameId && playerId && readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "register", gameId, playerId }));
    }
  }, [gameId, playerId, readyState]);

  useEffect(() => {
    if (!lastMessage) return;

    const msg = lastMessage.data;
    console.info("Recieved message:", msg);
    if (typeof msg === "string" && messageHandlers[msg])
      messageHandlers[msg]({ navigate, gameId });
  }, [lastMessage?.data]);

  // queries for data
  const { data: game, isLoading: gameStateLoading } = useGameState(gameId);
  const gameState = game?.gameState;
  const currentScenario = game?.currentScenario;

  const { data: players, isLoading: playerDataLoading } = usePlayers(gameId);
  const playerData = players?.find((player) => player.id === playerId);

  const { data: scenarios, isLoading: scenariosLoading } = useScenarios(
    gameId,
    gameState
  );

  const { data: votes, isLoading: votesLoading } = useVotes(gameId, gameState);

  const { data: guesses, isLoading: guessesLoading } = useGuesses(
    gameId,
    gameState
  );

  const { data: winningSongs, isLoading: winningSongsLoading } =
    useWinningSongs(gameId, gameState);

  const { data: songs, isLoading: songsLoading } = useSongs(gameId, gameState);

  const loading =
    gameStateLoading ||
    playerDataLoading ||
    scenariosLoading ||
    songsLoading ||
    votesLoading ||
    guessesLoading ||
    winningSongsLoading;

  return (
    <GameContext.Provider
      value={{
        gameId,
        playerId,
        playerName: playerData?.name,
        isMod: isMod || playerData?.isMod,
        setGameCookie,
        gameState,
        currentScenario,
        players,
        scenarios,
        songs,
        winningSongs,
        votes,
        guesses,
        loading,
        sendMessage,
      }}
    >
      <Layout>
      {children}
      </Layout>
    </GameContext.Provider>
  );
};
