import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import "@splidejs/react-splide/css";
import { BiSolidBookAlt } from "react-icons/bi";
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";
import { useState, useEffect, useMemo } from "react";
import { Book } from "./Book";

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
  const [test, setTest] = useState([]);
  const [bookChunks, setBookChunks] = useState([]); 
  // const [covers, setCovers] = useState([]);

  useEffect(() => {
    getBooks("programming"); // Fetch programming books initially
  }, []);


  const getBooks = async (bookType) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${bookType}`
      );
      const data = await response.json();
      const booksWithCovers = data.docs.filter((item) => item.cover_i);
      setDisplayedData(booksWithCovers.slice(0, 8));
      console.log(displayedData, "only God knows")
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // const getTwo = async (arr) => {
  //   const newArr = await arr.slice(0, 2);
  //   console.log(newArr);
  //   setTest(newArr);
  // };


  useEffect(() => {
    // Divide the displayedData into smaller chunks
    const chunkSize = 2;
    const chunks = [];
    for (let i = 0; i < displayedData.length; i += chunkSize) {
      chunks.push(displayedData.slice(i, i + chunkSize));
    }
    setBookChunks(chunks); // Update the bookChunks state
    console.log(bookChunks, "please")
  }, [displayedData]);

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

  // useEffect(() => {
  //   setDisplayedData(books.slice(0, 4));
  // }, [books]);

  // useEffect(() => {
  //   // Extract cover_i values from displayedData
  //   const extractedCovers = displayedData.map(item => item.cover_i);
  //   setCovers(extractedCovers);
  // }, [displayedData]);

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
        className="border-2 border-red-500"
      >
        <SplideSlide>
          <Slide handleClick={() => getBooks("programming")} type="textbook" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => getBooks("science")} type="history" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => getBooks("history")} type="adventure" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => getBooks("science")} type="science" />
        </SplideSlide>

        <SplideSlide>
          <Slide handleClick={() => getBooks("biography")} type="biography" />
        </SplideSlide>

        <SplideSlide>
          <Slide
            handleClick={() => getBooks("computer science")}
            type="computer"
          />
        </SplideSlide>
      </Splide>

      <div className="display border-2 border-red-500  justify-evenly ">
        <div className="border-2 border-green-300 md:flex w-full">
          <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks.length > 0 ? (
              bookChunks[0].map((item, index) => (
                <Book key={index} cover={item.cover_i} title={item.title.trim().split(" ").slice(0, 2).join(" ")} autor={item.author}/>
              ))
            ) : (
              <p>loading...</p>
            )}
          </div>

          <div className="flex w-full md:w-1/2 justify-evenly">
             {bookChunks.length > 0 ? (
              bookChunks[1].map((item, index) => (
                <Book key={index} cover={item.cover_i} title={item.title.trim().split(" ").slice(0, 2).join(" ")} />
              ))
            ) : (
              <p>loading....</p>
            )}
          </div>
        </div>
        <div className="border-2 border-green-300 md:flex w-full hidden ">
        <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks.length > 0 ? (
              bookChunks[2].map((item, index) => (
                <Book key={index} cover={item.cover_i} title={item.title.trim().split(" ").slice(0, 2).join(" ")} />
              ))
            ) : (
              <p>testing</p>
            )}
          </div>
          <div className="flex w-full md:w-1/2 justify-evenly">
          {bookChunks.length > 0 ? (
              bookChunks[3].map((item, index) => (
                <Book key={index} cover={item.cover_i} title={item.title.trim().split(" ").slice(0, 2).join(" ")} />
              ))
            ) : (
              <p>loading...</p>
            )}
          </div>
        </div>

        {/* <div>
          <div className="flex flex-wrap justify-evenly">
          {displayedData.length > 0 ? (
        displayedData.map((item, index) => (
          <Book key={index} title={item.title} cover={item.cover_i}/>
        ))
      ) : (
        <p>No data available</p>
      )}
          </div>
        </div> */}
        <div></div>
      </div>
    </>
  );
};
