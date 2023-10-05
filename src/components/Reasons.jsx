import React from "react";
import { ReasonCard } from "./ReasonCard";
import { reasonCardsDatas } from "../reasonCardsDatas";
import { Text } from "./Text";

export const Reasons = () => {
  return (
    <div className="mt-6 mb- leading-normal p-[1.30506rem] md:p-[4.2rem]">

    <Text head="Why Use Bookbay ?"/>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 sm:w-[90%] md:grid-cols-2 lg:grid-cols-3 gap-6 md:w-[90%] md:gap-x-1 lg:w-[95%] lg:gap-x-10 xl:gap-10 xl:w-[92%] mx-auto">
        
       {reasonCardsDatas.map((card, index)=> <ReasonCard key={index} {...card} />)}


      </div>
    </div>
  );
};
