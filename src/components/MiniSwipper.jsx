import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";
import { useState, useEffect, useMemo } from "react";
import { Book } from "./Book";
import { BiCode, BiCodeAlt } from "react-icons/bi";
import { MdHistoryEdu } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { BiBookBookmark } from "react-icons/bi";
import { GiLevelThreeAdvanced } from "react-icons/gi";
import { GiMaterialsScience } from "react-icons/gi";
import "react-loading-skeleton/dist/skeleton.css";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { Slide } from "./Slide";
import {Button} from "./Button"

export const MiniSwipper = () => {
  
  const [bookChunks, setBookChunks] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
  const [loading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("programming");

  useEffect(() => {
    getBooks("programming"); // Fetch programming books initially
  }, []);


  const fn = (data) => {
    const chunkSize = 2;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks
  };

  // Api call to get books
  const getBooks = async (bookType) => {

      setIsLoading(true);
      console.log(bookChunks, "getting every shit")
      // Api endpoint
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${bookType}`
      ).catch((error)=>{
        console.log("error in catch: ", error);
      })
      const data = await response.json();
      // Filter the data and get books with cover image
      const booksWithCovers = data.docs.filter((item) => item.cover_i);
      // Get the first eight books to be displayed
      const intialAuthor = booksWithCovers.map((item) => {
        return item.author_name[0]
      })
      console.log(intialAuthor, "authors")
      let chunks = fn(booksWithCovers)
      setBookChunks(chunks); // Update the bookChunks state
      console.log(bookChunks, "understanding ever shit")
      setIsLoading(false);
  };


  // const slidesPerPage = useMemo(() => {
  //   const screenWidth = window.innerWidth;
  //   if (screenWidth >= 1200) {
  //     console.log(screenWidth);
  //     return 4.5;
  //   } else if (screen >= 1400) {
  //     return 4.5;
  //   } else if (screenWidth >= 768) {
  //     console.log(screenWidth);
  //     return 3;
  //   } else if (screenWidth >= 400) {
  //     console.log(screenWidth);
  //     return 2.2;
  //   } else {
  //     console.log(screenWidth);
  //     return 2.2;
  //   }
  // }, []);

  return (
    <>
      <Splide
        options={{
          rewind: true,
          gap: "0.5rem",
          arrows: false,
          perPage: 3,
          perMove: 1,
          rewindByDrag: true,
          rewindSpeed: 1000,
          pagination: false,
          // drag: true,
          drag   : 'free',
        }}
        aria-label="My Favorite Images"
        className=""
      >
        <SplideSlide>
        <div className="border-[1px] card border-solid rounded-[0.25075rem] md:rounded-[0.5rem] flex cursor-pointer hover:border-[#fff] active:bg-[#0F9D58] hover:text-[#fff] hover:bg-[#0F9D58]">
    <button
      className="w-full px-[0.5rem] py-[0.5rem] md:py-[0.5rem] md:px-[1rem] items-center gap-2 md:gap-[0.5rem] flex"
      onClick={() => { getBooks("programming")}}
    >
      <BiCodeAlt className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]"/>
      <span className="roboto font-bold capitalize text-[0.75219rem] md:text-[1.5rem] leading-normal text-style">
        programming
      </span>
    </button>
    </div>
        </SplideSlide>

        <SplideSlide>
          <Slide
            handleClick={() => {
              getBooks("science");
              setSelectedCategory("science");
            }}
            type="science"
            icon={
              <GiMaterialsScience className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>

        <SplideSlide>
          <Slide
            handleClick={() => {
              getBooks("history");
              setSelectedCategory("history");
            }}
            type="history"
            icon={
              <MdHistoryEdu className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>

        <SplideSlide>
          <Slide
            handleClick={() => {
              getBooks("computer science");
              setSelectedCategory("computer");
            }}
            type="computer"
            icon={
              <FaComputer className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>

        <SplideSlide>
          <Slide
            handleClick={() => {
              getBooks("adventures");
              setSelectedCategory("adventures");
            }}
            type="adventures"
            icon={
              <GiLevelThreeAdvanced className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>

        <SplideSlide>
          <Slide
            handleClick={() => getBooks("biography")}
            type="biography"
            icon={
              <BiBookBookmark className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
      </Splide>

      <div className="display p-2 book-container md:w-[95%] mx-auto md:flex justify-evenly">
  <div className="flex w-full md:w-1/2 justify-evenly">
    {bookChunks &&
      bookChunks[0].map((item, index) => (
        <Book
          key={index}
          cover={item?.cover_i}
          title={item?.title?.trim().split(" ").slice(0, 2).join(" ")}
          year={item?.first_publish_year}
          author={item?.author_name}
          loading={loading}
        />
      ))}
  </div>
  <div className="flex w-full md:w-1/2 justify-evenly">
    {bookChunks &&
      bookChunks[1].map((item, index) => (
        <Book
          key={index}
          cover={item?.cover_i}
          title={item?.title?.trim().split(" ").slice(0, 2).join(" ")}
          year={item?.first_publish_year}
          author={item?.author_name}
          loading={loading}
        />
      ))}
  </div>
</div>


      <div className="hidden p-2 md:flex justify-evenly md:w-[95%] mx-auto">
      <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks &&
            bookChunks[2].map((item, index) => (
              <Book
                key={index}
                cover={item?.cover_i}
                title={item?.title?.trim().split(" ").slice(0, 2).join(" ")}
                year={item?.first_publish_year}
                author={item?.author_name}
                loading={loading}
              />
            ))}
        </div>
        <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks &&
            bookChunks[3].map((item, index) => (
              <Book
                key={index}
                cover={item?.cover_i}
                title={item?.title?.trim().split(" ").slice(0, 2).join(" ")}
                year={item?.first_publish_year}
                author={item?.author_name}
                loading={loading}
              />
            ))}
        </div>
      </div>
      <Link
        to={`/category/${selectedCategory}`}
        className="my-[2px] roboto font-normal leading-normal text-[0.875rem] md:text-[1.5rem] capitalize text-style text-[#4285F4] flex justify-end w-[80%] md:w-[95%] mx-auto items-center"
      >
        <span className="underline">see more </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>
      <hr className=" h-[1px] mx-auto mt-8 w-[90%] border-[#333] " />
    </>
  );
};

