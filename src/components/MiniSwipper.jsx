import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import "@splidejs/react-splide/css";
import { BiSolidBookAlt } from "react-icons/bi";
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";
import { useState, useEffect, useMemo } from "react";
import { Book } from "./Book";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
const Slide = ({ handleClick, type }) => {
  return (
    <div className="border-[1px] card border-solid rounded-[0.25075rem] md:rounded-[0.5rem] flex cursor-pointer hover:border-[#fff] active:bg-[#0F9D58] hover:text-[#fff] hover:bg-[#0F9D58]">
      <button
        className="[0.25075rem] px-[0.2rem] py-[0.5rem] md:py-[0.5rem] md:px-[1rem] items-center gap-2 md:gap-[0.5rem] flex justify-evenly  "
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
  // const [books, setBooks] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [bookChunks, setBookChunks] = useState([]);
  const [loading, setIsLoading] = useState(true);
  // const [covers, setCovers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("programming"); 

  useEffect(() => {
    getBooks("programming"); // Fetch programming books initially
  }, []);

  const getBooks = async (bookType) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${bookType}`
      );
      const data = await response.json();
      const booksWithCovers = data.docs.filter((item) => item.cover_i);
      setDisplayedData(booksWithCovers.slice(0, 8));
      console.log(displayedData, "only God knows");
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
      console.log("Loading state set to false.");
    }
  };


  useEffect(() => {
    // Divide the displayedData into smaller chunks
    const chunkSize = 2;
    const chunks = [];
    for (let i = 0; i < displayedData.length; i += chunkSize) {
      chunks.push(displayedData.slice(i, i + chunkSize));
    }
    setBookChunks(chunks); // Update the bookChunks state
    console.log(bookChunks, "please");
    // setIsLoading(false); // Set loading to false once data is processed
    // console.log(bookChunks[1][0].author_name[0])
  }, [displayedData]);

  useEffect(() => {
    // Once the bookChunks are populated, loading is set to false
    if (bookChunks.length > 0) {
      setIsLoading(false);
    }
  }, [bookChunks]);


  const slidesPerPage = useMemo(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1200) {
      return 4.5;
    } else if (screenWidth >= 768) {
      return 3;
    } else if (screenWidth >= 400) {
      return 2.5;
    } else {
      return 2;
    }
  }, []);


  return (
    <>
      <Splide
        options={{
          rewind: true,
          gap: "0.5rem",
          arrows: false,
          perPage: slidesPerPage,
          pagination: false, // Set pagination to false
        }}
        aria-label="My Favorite Images"
        className=""
      >
        <SplideSlide>
          <Slide handleClick={() => {getBooks("programming");
            setSelectedCategory("programming"); 
            console.log(selectedCategory)
        }} type="programming" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => {getBooks("science");
          setSelectedCategory("science"); 
        }} type="science" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => {getBooks("history");
           setSelectedCategory("history"); 
          }} type="history" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => {getBooks("science");
           setSelectedCategory("science"); 
          }} type="science" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => getBooks("biography")} type="biography" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => {getBooks("computer science");
           setSelectedCategory("computer"); 
          }} type="computer" />
        </SplideSlide>
      </Splide>

      <div className="display md:flex border-2 border-yellow-500  justify-evenly ">

      <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks[1] && !loading ? (
            bookChunks[1].map((item, index) => (
              <Book
                key={index}
                cover={item.cover_i}
                title={item.title.trim().split(" ").slice(0, 2).join(" ")}
                year={item.first_publish_year}
                loading={loading}
              />
            ))
          ) : (
            <Skeleton
              height={250}
              width="100%"
              baseColor="#202020"
              highlightColor="#444"
            />
          )}
        </div>
        
      <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks[0] && !loading ? (
            bookChunks[0].map((item, index) => (
              <Book
                key={index}
                cover={item.cover_i}
                title={item.title.trim().split(" ").slice(0, 2).join(" ")}
                year={item.first_publish_year}
                loading={loading}
              />
            ))
          ) : (
            <Skeleton
              height={250}
              width="100%"
              baseColor="#202020"
              highlightColor="#444"
            />
          )}
        </div>
       
      </div>

      <div className="hidden md:flex border-2 border-blue-500  justify-evenly ">

      <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks[2] && !loading ? (
            bookChunks[2].map((item, index) => (
              <Book
                key={index}
                cover={item.cover_i}
                title={item.title.trim().split(" ").slice(0, 2).join(" ")}
                year={item.first_publish_year}
                loading={loading}
              />
            ))
          ) : (
            <Skeleton
              height={250}
              width="100%"
              baseColor="#202020"
              highlightColor="#444"
            />
          )}
        </div>
      <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks[3] && !loading ? (
            bookChunks[3].map((item, index) => (
              <Book
                key={index}
                cover={item.cover_i}
                title={item.title.trim().split(" ").slice(0, 2).join(" ")}
                year={item.first_publish_year}
                loading={loading}
              />
            ))
          ) : (
            <Skeleton
              height={250}
              width="100%"
              baseColor="#202020"
              highlightColor="#444"
            />
          )}
        </div>
       
      </div>
      <Link   to={`/category/${selectedCategory}`} className="my-[2px] roboto font-normal leading-normal text-[0.875rem] md:text-[1.5rem] capitalize text-style text-[#4285F4] flex justify-end w-[80%] md:w-[95%] mx-auto items-center">
        <span className="underline">see more </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>
    </>
  );
};
