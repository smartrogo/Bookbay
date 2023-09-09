import React from "react";
import { Button } from "./Button";
import audio from "../assets/audio.svg"
import buyCart from "../assets/buyCart.svg"
import reads from "../assets/reads.svg"
import sell from "../assets/sell.svg"
import secure from "../assets/secure.svg"
import borrow from "../assets/borrow.svg"
import { ReasonCard } from "./ReasonCard";


export const Reasons = () => {
  return (
    <div className="mb-10 leading-normal p-[1.30506rem] md:p-[4.2rem] border-2">

      <h1 className="text-center mb-8 text-[1.5rem] md:text-[3rem] roboto font-bold">
        Why use Bookbay ?
      </h1>

      <div className="border-2 border-red-500 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 sm:w-[90%] md:grid-cols-2 lg:grid-cols-3 gap-6 md:w-[90%] md:gap-x-1 lg:w-[95%] lg:gap-x-10 xl:gap-x-2 xl:w-[90%] mx-auto">
        
        <ReasonCard text_color="#7E4FFD" cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[21.5625rem] md:h-[13rem] md:p-[0.5rem] my- why mx-auto bg-[#F5F3FF]" icon={reads} title="Read to Earn" body="Is a compelling concept where you can be rewarded for your reading activities. by offering incentives such as tokens, discounts."/>

        <ReasonCard text_color="#5098FD"
        cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[21.5625rem] md:h-[13rem] md:p-[0.5rem] why mx-auto bg-[#F6F9FE]" icon={borrow} title="Borrow" body="Access a vast library of books, including rare and hard-to-find titles, through our borrowing service, saving you money and space."/>

        <ReasonCard text_color="#E7439C"
        cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[21.5625rem] md:h-[13rem] md:p-[0.5rem] why mx-auto bg-[#FEF5F8]" icon={buyCart} title="Buy" body="Shop for both new and used books at budget-friendly prices, making it easy to expand your personal collection."/>
        
        <ReasonCard text_color="#45D7B5"
        cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[21.5625rem] md:h-[13rem] md:p-[0.5rem] why mx-auto bg-[#EEFAF6]" icon={sell} title="Sell" body="Earn money by selling your own books and research papers, turning your bookshelf/research into a potential source of income."/>

        <ReasonCard text_color="#FBAE14"
        cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[21.5625rem] md:h-[13rem] md:p-[0.5rem] why mx-auto bg-[#FEFBF2]" icon={audio} title="Audio books" body="Immerse yourself in listening adventures, discover new genres, and enjoy a diverse range of titles, all conveniently accessible."/>

        <ReasonCard text_color="#7E4FFF"
        cls_name="mr block box-sha rounded-[1rem] w-[308px] h-[208.81px] md:w-[21.5625rem] md:h-[13rem] md:p-[0.5rem] why mx-auto bg-[#EEFAF6]" icon={secure} title="Secure transaction" body="Bookbay prioritizes secure transactions to ensure the safety of your financial information and personal data."/>


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
