import React from "react";

export const Text = (props) => {
  return (
      <div className="outfit  text-style text-center leading-normal  mb-2 md:mb-[2rem]">
        <h1 className="font-bold text-[1.5rem] md:text-[3rem] text-[#00f] outfit">
          {props.head}
        </h1>

        <p className="capitalize px-12 para poppins text-[0.5rem] font-normal md:text-[1rem] md:px-[24] md:w-[48.3125rem] mx-auto">
         {props.body}
        </p>
      </div>
  );
};
