import React from "react";

const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={() => onClick()}
      className=" bg-gradient-to-r  from-purple-500 via-pink-500 to-yellow-400 text-3xl font-extrabold text-white py-2 rounded-full shadow-lg px-3 py-2 "
    >
      {children}
    </button>
  );
};

export default Button;
