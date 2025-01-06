import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import CreateGame from "./CreateGame/CreateGame";

export const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateGame />} />
        {/* this is a redirect -> if you have cookie you are sent to the right game state, if you don't, you're prompted to join the game */}
        <Route path="/game/:id" element={<></>} />

        {/* mod enters scenarios and publish / players enter scenario songs / mod starts game rounds  */}
        <Route path="/game/:id/set-up" element={<></>} />

        <Route path="/game/:id/music/:scenario" element={<></>} />

        <Route path="/game/:id/vote/:scenario" element={<></>} />

        <Route path="/game/:id/guess/:scenario" element={<></>} />

        <Route path="/game/:id/results" element={<></>} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
