import React from "react";
import { ReasonCard } from "./ReasonCard";
import { reasonCardsDatas } from "../reasonCardsDatas";

export const Reasons = () => {
  return (
    <div className="mt-6 mb- leading-normal p-[1.30506rem] md:p-[4.2rem]">

      <h1 className="text-center mb-8 text-[1.5rem] md:text-[3rem] roboto font-bold">
        Why Use Bookbay ?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 sm:w-[90%] md:grid-cols-2 lg:grid-cols-3 gap-6 md:w-[90%] md:gap-x-1 lg:w-[95%] lg:gap-x-10 xl:gap-x-2 xl:w-[90%] mx-auto">
        
       {reasonCardsDatas.map((card, index)=> <ReasonCard key={index} {...card} />)}


      </div>
    </div>
  );
};
