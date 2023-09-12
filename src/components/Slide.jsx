import React from 'react';
import { BiSolidBookAlt } from "react-icons/bi";


export const Slide = ({ handleClick, type }) => {
  return (
    <div className="border-[1px] card border-solid w-[97] rounded-[0.25075rem] md:rounded-[0.5rem] flex cursor-pointer hover:border-[#fff] active:bg-[#0F9D58] hover:text-[#fff] hover:bg-[#0F9D58]">
    <button
      className="w-full border-2 border-red-500 px-[0.2rem] py-[0.5rem] md:py-[0.5rem] md:px-[1rem] items-center gap-2 md:gap-[0.5rem] flex justify-evenly  "
      onClick={handleClick}
    >
      <BiSolidBookAlt className=" w-[2rem] h-[2rem] md:w-[2.75rem] md:h-[2.75rem]" />{" "}
      <span className="roboto font-bold capitalize text-[1rem] md:text-[1.5rem] leading-normal text-style">
        {type}
      </span>
    </button>
  </div>
  )
};