import React from "react";
import { Text } from "./Text";
import Input from "./Input";
import { Button } from "./Button";

export const Newslatter = () => {
  return (
    <div className="flex items-center justify-end mb-10 mx-auto">
      <div className="w-[88%] md:w-[60%] mx-auto">
        <div className="mx-auto flex flex-col items-center ">

         <div className="mt-0">
         <Text
            head="Subscribe To Our Newsletter"
            body="Lorem ipsum dolor sit amet consectetur. Diam ut feugiat aliquet in varius feugiat magna dictum. Tortor diam et placerat."
          />
         </div>

          <div className="w-full mx-auto">
            <Input
              id="email"
              name="email"
              label_cls_name="leading-normal poppins capitalize text-[0.66725rem] font-normal"
              type="email"
              placeholder="example@gmail.com"
              cls_name="w-[100%] mx-auto card rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#0F9D58] focus:ring-[2px] focus:ring-[#abeacc] text-base outline-none text-[#696969] py-1 mt-4 md:-mt-10 placeholder:text-center px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            <Button
              value="subscribe"
              cls_name="bg-[#0F9D58] mx-auto w-full rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#fff] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
