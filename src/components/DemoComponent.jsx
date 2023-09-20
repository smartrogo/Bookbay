import React from "react";
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
// Or, if you have to support IE9
import "@egjs/react-flicking/dist/flicking-inline.css";

const DemoComponent = () => {
  return (
    <div className="flex justify-center items-center">
      <Flicking
        className="mt-40 w-full p-4 border-2 border-red-600"
        moveType="freeScroll"
        bound={true}
        align="center" // or "prev"
      >
        <span className=" mr-2 border-2 border-green-400 is-white card border-solid rounded-[0.25075rem] md:rounded-[0.5rem] text-[0.75219rem] uppercase py-[0.25075rem] px-[0.5015rem] roboto backdrop: flex cursor-pointer hover:border-[#fff] active:bg-[#0F9D58] hover:text-[#fff] hover:bg-[#0F9D58]">
          🍎 Apple
        </span>
        <span className="button mr-2 is-white">🍉 Watermelon</span>
        <span className="button mr-2 is-white">🥝 Kiwi</span>
        <span className="button mr-2 is-white">🥝 Kiwi</span>
        <span className="button mr-2 is-white">🥝 Kiwi</span>
        <span className="button mr-2 is-white">🥝 Kiwi</span>
        <span className="button mr-2 is-white">...</span>
      </Flicking>
    </div>
  );
};

export default DemoComponent;
