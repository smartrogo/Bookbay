import React from "react";
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
// Or, if you have to support IE9
import { BiBookBookmark } from "react-icons/bi";
import "@egjs/react-flicking/dist/flicking-inline.css";

const DemoComponent = () => {
  return (
    <div className="flex justify-center items-center">
      <Flicking
        className="mt-40 w-full  flex justify-evenly p-4 border-2 border-red-600"
        moveType="freeScroll"
        bound={true}
        // align="center" // or "prev"
      >
        <span className=" mr-2 border-[1px] card border-solid rounded-[0.25075rem] md:rounded-[0.5rem] flex items-center cursor-pointer hover:border-[#fff] active:bg-[#0F9D58] hover:text-[#fff] hover:bg-[#0F9D58]">
          <BiBookBookmark className="w-[1.37906rem] h-[1.37906rem]" />
          <p className="roboto font-bold capitalize text-[0.75219rem] md:text-[1.5rem] leading-normal text-style">
            Apple
            
          </p>
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
