import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const usePlayer = (gameId) => {
  const [cookies, setCookie] = useCookies(["sns-game"]);
  const cookie = cookies["sns-game"];

  const [player, setPlayer] = useState({
    playerId: cookie?.playerId ?? "",
    isMod: cookie?.isMod ?? false,
  });

  useEffect(() => {
    if (gameId && gameId !== cookie?.gameId) {
      setCookie("sns-game", { gameId, playerId: "", isMod: false });
    }
  }, [gameId, cookie?.gameId, setCookie]);

  useEffect(() => {
    setPlayer({
      playerId: cookie?.playerId ?? "",
      isMod: cookie?.isMod ?? false,
    });
  }, [cookie?.isMod, cookie?.playerId]);

  const setGameCookie = ({ gameId, playerId, isMod }) => {
    setCookie("sns-game", { gameId, playerId, isMod });
    setPlayer({ playerId, isMod });
  };

  return { player, setGameCookie };
};

export default usePlayer;