import React from "react";

export const Text = (props) => {
  return (
      <div className="roboto text-style text-center leading-normal mt-10 mb-2 md:mb-[2rem]">
        <h1 className="text-[#000] font-bold text-[1.5rem] md:text-[3rem] roboto ">
          {props.head}
        </h1>

        <p className="capitalize px-12 text-[#666] poppins text-[0.5rem] font-normal md:text-[1rem] md:px-[24] md:w-[48.3125rem] mx-auto">
         {props.body}
        </p>
      </div>
  );
};
