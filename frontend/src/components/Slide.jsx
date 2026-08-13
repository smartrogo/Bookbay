import React from 'react';


export const Slide = ({ handleClick, type, icon }) => {
  return (
    <div className="border-[1px] text-[#000] border-solid border-[#000] rounded-[0.25075rem] md:rounded-[0.5rem] flex cursor-pointer hover:border-[#00F] active:text-[#00F] active hover:text-[#00F] hover:bg-transprent">
    <button
      className="w-full px-[0.5rem] py-[0.5rem] md:py-[0.5rem] md:px-[1rem] items-center flex justify-evenly"
      onClick={handleClick}
    >
      {icon}
      <span className="capitalize text-[0.75219rem] md:text-[1.4rem] leading-normal text-style">
        {type}
      </span>
    </button>
  </div>
  )
};