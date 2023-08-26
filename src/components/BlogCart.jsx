import React from "react";
import blog1 from "../assets/blog1.png";
import { Link } from "react-router-dom";
import { Button } from "./Button";

export const BlogCart = () => {
  return (
    <div>
      <div className="max-w-sm my-8 bg-[#eee] border rounded-[1rem] shadow text-start mx-auto">
        <div className="relative">
          <Link to="/">
            <img
              className="rounded-t-[1rem] w-[23.57394rem] h-[16.66694rem] md:w-[33.86506rem] object-cover"
              src={blog1}
              alt=""
            />
          </Link>

          <Button
            value="10 october, 2023"
            cls_name=" absolute bg-[#0F9D58] rounded-[0.30031rem] border-[1.802px] border-solid border-[#eee] w-[7.54519rem] h-[2.28981rem] py-[0.63813rem] px-[0.23875rem] roboto text-[#fff] text-[0.67569rem] text-style font-bold leading-normal left-7 -bottom-5"
          />
        </div>

        <div className="p-5 leading-normal text-style roboto mt-4">
          <a href="#">
            <h2 className=" text-[#000]   font-bold text-[0.67569rem] w-[12.95063rem] md:w-[18.60425rem] md:text-[0.97063rem]">
              Unlocking Reading Adventures: Your Guide to Getting Started with
              BookBay
            </h2>
          </a>
          <p className="mb-3 mt-2 w-[20.15794rem] md:w-[98%] border-2 border-red-500 text-[#666] font-normal text-[0.60063rem] md:text-[0.86281rem] text-style">
            Lorem ipsum dolor sit amet consectetur. Viverra in lacinia nisl mi
            mattis turpis nibh blandit. Nulla in massa sollicitudin non. Cum
            nulla et suscipit sed viverra magna magna diam.
          </p>
          {/* <a
            href="#"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Read more
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a> */}
        </div>
      </div>
    </div>
  );
};
