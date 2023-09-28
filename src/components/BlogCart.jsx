import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import {LiaLongArrowAltRightSolid} from "react-icons/lia"

export const BlogCart = (props) => {
  return (
    <div className="px-4 md:px-7">
      <div className="max-w-sm my-8 pb-4 card box rounded-[1rem] shadow text-start mx-auto">
        <div className="relative">
          <Link to="/">
            <img
              className="rounded-t-[1rem] w-full h-[16.66694rem] md:w-[33.86506rem] object-cover"
              src={props.img}
              alt=""
            />
          </Link>

          <Button
            value="10 october, 2023"
            cls_name="absolute btn bg-[#0F9D58] rounded-[0.30031rem] border-[1.802px] border-solid border-[#eee] w-[7.54519rem] h-[2.28981rem] py-[0.63813rem] px-[0.23875rem] roboto text-[#fff] text-[0.67569rem] text-style font-bold leading-normal left-[1.87rem] -bottom-5"
          />
        </div>

        <div className="p-5 leading-normal relative text-style roboto mt-4">
          <a href="#">
            <h2 className="font-bold text-[0.67569rem] w-[12.95063rem] md:w-[18.60425rem] md:text-[0.97063rem]">
              Unlocking Reading Adventures: Your Guide to Getting Started with
              BookBay
            </h2>
          </a>
          <p className="mb-3 mt-2 w-[100%] md:w-[98%] qoute font-normal text-[0.60063rem] md:text-[0.86281rem] text-style">
            Lorem ipsum dolor sit amet consectetur. Viverra in lacinia nisl mi
            mattis turpis nibh blandit. Nulla in massa sollicitudin non. Cum
            nulla et suscipit sed viverra magna magna diam.
          </p>

          <Link
        to="/"
        className="absolute roboto mb-2 font-normal leading-normal text-[0.60031rem] md:text-[0.86281rem] capitalize text-style text-[#4285F4] flex gap-[0.2rem] md:w-[9rem]  -right-1 w-[6rem] md:-right-10 links items-center"
      >
        <span className="underline">see more </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>
        </div>
      </div>
    </div>
  );
};
