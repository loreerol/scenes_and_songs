import React from "react";

const Wavey = ({ text = "Please wait..." }) => {
  const characters = text.split("");

  return (
    <div className="wave-animation text-center absolute flex text-4xl text-white ">
      {characters.map((char, index) => (
        <span key={index} style={{ "--i": index + 1 }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
};

export default Wavey;