import React from 'react';


export const Slide = ({ handleClick, type, icon }) => {
  return (
    <div className="border-[1px] card border-solid rounded-[0.25075rem] md:rounded-[0.5rem] flex cursor-pointer hover:border-[#fff] active:bg-[#0F9D58] hover:text-[#fff] hover:bg-[#0F9D58]">
    <button
      className="w-full px-[0.5rem] py-[0.5rem] md:py-[0.5rem] md:px-[1rem] items-center gap-2 md:gap-[0.5rem] flex"
      onClick={handleClick}
    >
      {icon}
      <span className="roboto font-bold capitalize text-[0.75219rem] md:text-[1.5rem] leading-normal text-style">
        {type}
      </span>
    </button>
  </div>
  )
};