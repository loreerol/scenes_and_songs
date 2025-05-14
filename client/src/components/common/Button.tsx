import React, { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-3xl font-extrabold text-white py-2 rounded-full shadow-lg px-3"
    >
      {children}
    </button>
  );
};

export default Button;
