import React from "react";
import { Button } from "./Button";
import Input from "./Input";
import stay from "../assets/stay.png"

export const Contact = () => {
  return (
    <section className="relative mb-10">
      <img src={stay} alt="" className="absolute w-[34.80581rem] md:right-[14.5rem] md:-top-[3.9rem]" />
      <div className="w-[94.5%] md:w-[75%] px-5 md:px-12 pb-4 md:pb-10 mx-auto flex sm:flex-nowrap flex-wrap">
        <div className="lg:w-1/2 flex flex-col w-full md:py-8 mt-8 md:mt-0">
          <h2 className=" poppins text-[1.03794rem] md:text-[1.75rem] text-style mb-1 font-bold leading-normal title-font capitalize">
            contact us
          </h2>

          <Input
            label="Email:"
            id="email"
            name="email"
            label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
            type="email"
            placeholder="example@gmail.com"
            cls_name="w-full card rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#0F9D58] focus:ring-[2px] focus:ring-[#abeacc] text-base outline-none text-[#696969] py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />

          <Input
            label="Name:"
            id="name"
            name="name"
            label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
            cls_name="w-full card rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#0F9D58] focus:ring-[2px] focus:ring-[#abeacc] text-base outline-none text-[#696969] py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            type="text"
            placeholder="Muhammad Ni'imatullahi"
          />

          <div className="relative mb-4">
            <label
              htmlFor="message"
              className="leading-normal poppins capitalize text-[0.66725rem] font-normal"
            >
              Message:
            </label>

            <textarea
              id="message"
              name="message"
              className="w-full card rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#0F9D58] focus:ring-[2px] focus:ring-[#abeacc] h-32 text-base outline-none text-[#696969] py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              placeholder="Your Message"
            ></textarea>
          </div>

          <Button
            value="send"
            cls_name="bg-[#0F9D58] mx-auto rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#fff] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize"
          />
        </div>
      </div>
      <hr className=" h-[1px] mx-auto w-[90%] border-[#333] " />
    </section>
  );
};
