import React from "react";
import { Button } from "./Button";
import box from "../assets/box.svg"
import buy from "../assets/buy.svg"
import reads from "../assets/reads.svg"
import sound from "../assets/sound.svg"
import borrow from "../assets/borrow.svg"
import { ReasonCard } from "./ReasonCard";


export const Reasons = () => {
  return (
    <div className="mb-10 leading-normal p-[1.30506rem] md:p-[4.2rem] border-2">

      <h1 className="text-center mb-8 text-[1.5rem] md:text-[3rem] roboto font-bold">
        Why use Bookbay ?
      </h1>

      <div className="flex flex-wrap justify-center gap-6 md:justify-evenly md:w-[90%] mx-auto">
        
        <ReasonCard text_color="#7E4FFD" cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[20.25rem] md:h-[17.8125rem] my- why mx-auto bg-[#F5F3FF]" icon={reads} title="Read to Earn" body="Is a compelling concept where you can be rewarded for your reading activities. by offering incentives such as tokens, discounts."/>

        <ReasonCard text_color="#5098FD"
        cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[20.25rem] md:h-[17.8125rem] why mx-auto bg-[#F6F9FE]" icon={borrow} title="Borrow" body="Access a vast library of books, including rare and hard-to-find titles, through our borrowing service, saving you money and space."/>

        <ReasonCard text_color="#5098FD"
        cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[20.25rem] md:h-[17.8125rem] why mx-auto bg-[#F6F9FE]" icon={borrow} title="Borrow" body="Access a vast library of books, including rare and hard-to-find titles, through our borrowing service, saving you money and space."/>


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
