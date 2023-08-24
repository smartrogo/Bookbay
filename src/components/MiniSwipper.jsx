import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
// Default theme
import "@splidejs/react-splide/css";
import { BiSolidBookAlt } from "react-icons/bi";
// or other themes
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";
import { useState, useEffect } from "react";
export const MiniSwipper = () => {
  const [slidesPerPage, setSlidesPerPage] = useState(getSlidesPerPage());

  const handleSlideClick = (value) => {
    console.log(`${value} slide clicked`);
    // You can perform your desired action here
  };

  // Calculate the number of slides per page based on screen size
  function getSlidesPerPage() {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1200) {
      return 4.5; // Show 4 slides per page on larger screens
    } else if (screenWidth >= 768) {
      return 2.5; // Show 3 slides per page on medium screens
    } else if (screenWidth >= 400) {
      return 2.5;
    } else {
      return 2; // Show 2 slides per page on smaller screens
    }
  }

  // Update slides per page when the screen size changes
  useEffect(() => {
    function handleResize() {
      setSlidesPerPage(getSlidesPerPage());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Splide
      options={{
        rewind: true,
        gap: "0.5rem",
        arrows: false,
        perPage: slidesPerPage,
        pagination: false, // Set pagination to false
      }}
      aria-label="My Favorite Images"
      className="border-2 border-red-500"
    >
      <SplideSlide className="border-2 rounded-[0.25075rem] md:rounded-[0.5rem] flex cursor-pointer text-[#fff] bg-[#0F9D58] py-">
        <div className="[0.25075rem] px-[0.2rem] py-[0.5rem] w-full md:py-[0.5rem] md:px-[1rem] items-center gap-[0] md:gap-[0.5rem] flex justify-evenly" onClick={() => handleSlideClick("textbook")}>
          <BiSolidBookAlt className=" w-[2rem] h-[2rem] md:w-[2.75rem] md:h-[2.75rem]" />{" "}
          <span className="roboto font-bold capitalize text-[1rem] md:text-[1.5rem] leading-normal text-style">
            textbooks
          </span>
        </div>
      </SplideSlide>

      <SplideSlide className="border-2 cursor-pointer text-[#fff] justify-evenly bg-[#0F9D58] py-[0.5rem] px-[1rem] items-center gap-[0.5rem] flex">
        <BiSolidBookAlt className="w-[2.75rem] h-[2.75rem]" />{" "}
        <span className="roboto font-bold capitalize text-[1.5rem] text-style">
          History
        </span>
      </SplideSlide>

      <SplideSlide className="border-2 cursor-pointer text-[#fff] justify-evenly bg-[#0F9D58] py-[0.5rem] px-[1rem] items-center gap-[0.5rem] flex">
        <BiSolidBookAlt className="w-[2.75rem] h-[2.75rem]" />{" "}
        <span className="roboto font-bold capitalize text-[1.5rem] text-style">
          Adventure
        </span>
      </SplideSlide>

      <SplideSlide className="border-2 cursor-pointer text-[#fff] justify-evenly bg-[#0F9D58] py-[0.5rem] px-[1rem] items-center gap-[0.5rem] flex">
        <BiSolidBookAlt className="w-[2.75rem] h-[2.75rem]" />{" "}
        <span className="roboto font-bold capitalize text-[1.5rem] text-style">
          science
        </span>
      </SplideSlide>

      <SplideSlide className="border-2 cursor-pointer text-[#fff] justify-evenly bg-[#0F9D58] py-[0.5rem] px-[1rem] items-center gap-[0.5rem] flex">
        <BiSolidBookAlt className="w-[2.75rem] h-[2.75rem]" />{" "}
        <span className="roboto font-bold capitalize text-[1.5rem] text-style">
          Biography
        </span>
      </SplideSlide>

      <SplideSlide className="border-2 cursor-pointer text-[#fff] justify-evenly bg-[#0F9D58] py-[0.5rem] px-[1rem] items-center gap-[0.5rem] flex">
        <BiSolidBookAlt className="w-[2.75rem] h-[2.75rem]" />{" "}
        <span className="roboto font-bold capitalize text-[1.5rem] text-style">
          Fiction
        </span>
      </SplideSlide>
    </Splide>
  );
};
