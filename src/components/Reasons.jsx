import React from "react";
import { Button } from "./Button";
import box from "../assets/box.svg"
import read from "../assets/read.svg"
import buy from "../assets/buy.svg"
import secure from "../assets/secure.svg"
import sound from "../assets/sound.svg"
import borrow from "../assets/borrow.svg"
import { ReasonCard } from "./ReasonCard";


export const Reasons = () => {
  return (
    <div className="mb-10 capitalize leading-normal p-[2rem] md:p-[4.2rem] border-2">

      <h1 className="text-center mb-2 text-[1.5rem] md:text-[3rem] roboto font-bold">
        Why use Bookbay ?
      </h1>

      <div className="flex flex-wrap justify-center gap-6 md:justify-evenly md:w-[90%] mx-auto">
        <ReasonCard icon={read} title="read" body="Shop for both new and used books at budget-friendly prices, making it easy to expand your personal collection."/>
        <ReasonCard icon={borrow} title="borrow" body="Shop for both new and used books at budget-friendly prices, making it easy to expand your personal collection."/>
        <ReasonCard icon={buy} title="buy" body="Shop for both new and used books at budget-friendly prices, making it easy to expand your personal collection."/>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          value="Join us today !"
          cls_name="bg-[#0F9D58] btn text-[#FFFFFF] mx-auto rounded-[0.5rem] py-[0.56563rem] px-[1.09794rem] md:py-[1.0625rem] md:px-[2.0625rem] text-center"
        />
      </div>
    </div>
  );
};
