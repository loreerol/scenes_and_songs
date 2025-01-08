import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";

import CreateGame from "./CreateGame/CreateGame";
import GameRedirect from "./GameRedirect";
import GameSetup from "./GameSetup";
import { GameProvider } from "./GameProvider";
import "./styles.css";
import MusicPhase from "./MusicPhase";

export const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <BrowserRouter>
        <GameProvider>
          <Routes>
            <Route path="/" element={<CreateGame />} />
            <Route path="/game/:id" element={<GameRedirect />} />
            <Route path="/game/:id/set-up" element={<GameSetup />} />
            <Route path="/game/:id/music" element={<MusicPhase />} />
            <Route path="/game/:id/vote/:scenario" element={<></>} />
            <Route path="/game/:id/guess/:scenario" element={<></>} />
            <Route path="/game/:id/results" element={<></>} />
          </Routes>
        </GameProvider>
      </BrowserRouter>
    </CookiesProvider>
  </QueryClientProvider>
);
