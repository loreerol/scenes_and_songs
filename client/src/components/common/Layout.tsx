import React from "react";
import Header from "./Header";
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-600 flex flex-col items-center">
      <Header />
      <main className="w-full max-w-4xl mx-auto mt-8 px-6">
        <div className="relative grid gap-8"> {children} </div>
      </main>
    </div>
  );
};

export default Layout;
