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

const Slide = ({ handleClick, type }) => {
  return (
    <div className="border-[1px] border-solid border-[#000] rounded-[0.25075rem] md:rounded-[0.5rem] flex cursor-pointer hover:border-[#fff] active:bg-[#0F9D58] hover:text-[#fff] hover:bg-[#0F9D58]">
      <button
        className="[0.25075rem] px-[0.2rem] py-[0.5rem] md:py-[0.5rem] md:px-[1rem] items-center gap-[0] md:gap-[0.5rem] flex justify-evenly  "
        onClick={handleClick}
      >
        <BiSolidBookAlt className=" w-[2rem] h-[2rem] md:w-[2.75rem] md:h-[2.75rem]" />{" "}
        <span className="roboto font-bold capitalize text-[1rem] md:text-[1.5rem] leading-normal text-style">
          {type}
        </span>
      </button>
    </div>
  );
};

export const MiniSwipper = () => {
  const [slidesPerPage, setSlidesPerPage] = useState(getSlidesPerPage());

  const handleClick = (value) => {
    console.log("hello", value);
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
      <SplideSlide>
        <Slide handleClick={() => handleClick("textbook")} type="textbook" />
      </SplideSlide>

      <SplideSlide>
        <Slide handleClick={() => handleClick("history")} type="history"/>
      </SplideSlide>

      <SplideSlide>
        <Slide handleClick={() => handleClick("adventure")} type="adventure"/>
      </SplideSlide>

      <SplideSlide>
        <Slide handleClick={() => handleClick("science")} type="science"/>
      </SplideSlide>

      <SplideSlide>
        <Slide handleClick={() => handleClick("biography")} type="biography"/>
      </SplideSlide>

      <SplideSlide>
        <Slide handleClick={() => handleClick("computer science")} type="computer science"/>
      </SplideSlide>

    </Splide>
  );
};
