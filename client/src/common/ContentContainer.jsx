import React from "react";

const ContentContainer = ({title, text}) => {
  return (
        <>
          <h2 className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-white bg-purple-400 rounded-full px-6 py-2 shadow-md">
            {title}
          </h2>
          <textarea
            value={text}
            className={
              "w-full text-lg font-extrabold text-purple-900 border-4 border-purple-400 rounded-xl p-4 text-gray-900 bg-white focus:outline-none focus:ring-5 focus:ring-purple-500 placeholder-purple-400 cursor-default resize-none"
            }
            disabled
          />
        </>
  );
};

export default ContentContainer;
