import React from "react";
import blog2 from "../assets/blog2.jpg"

export const BlogCart = () => {
  return (
    <div>
      <div className="max-w-sm bg-[#eee] border rounded-[1rem] shadow text-start mx-auto">
        <a href="#">
          <img
            className="rounded-[1rem] w-[23.57394rem] h-[16.66694rem] object-cover"
            src={blog2}
            alt=""
          />
        </a>
        <div className="p-5 leading-normal roboto">
          <a href="#">
            <h5 className=" text-[#000] text-style  font-bold text-[0.67569rem] w-[12.95063rem]">
            Unlocking Reading Adventures: Your Guide to Getting Started with BookBay
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
          <a
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
          </a>
        </div>
      </div>
    </div>
  );
};
