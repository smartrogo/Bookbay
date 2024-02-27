import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";
import { useState, useEffect } from "react";
import { Book } from "./Book";
import { BiCodeAlt } from "react-icons/bi";
import { MdHistoryEdu } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { BiBookBookmark } from "react-icons/bi";
import { GiLevelThreeAdvanced } from "react-icons/gi";
import { GiMaterialsScience } from "react-icons/gi";
import "react-loading-skeleton/dist/skeleton.css";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { Slide } from "./Slide";
import { BookOpen } from "lucide-react";
import { PencilRuler } from "lucide-react";
import { FaChildren } from "react-icons/fa6";
import { GrTechnology } from "react-icons/gr";
import { MdChangeHistory } from "react-icons/md";
import { TbBusinessplan } from "react-icons/tb";
import { ChefHat } from "lucide-react";
import { HiPhotograph } from "react-icons/hi";
import { FaPlaceOfWorship } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { HeartPulse } from "lucide-react";
import { IoLibrary } from "react-icons/io5";
import { MdFamilyRestroom } from "react-icons/md";

export const MiniSwipper = () => {
  const [books, setBooks] = useState([]);
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
    return chunks;
  };

  // Api call to get books
  const getBooks = async (bookType) => {
    // setIsLoading(true);

    try {
      // API endpoint
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${bookType}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Filter the data and get books with cover image
      const booksWithCovers = data.docs.filter((item) => item.cover_i);

      // Get the first eight books to be displayed
      let chunks = fn(booksWithCovers);
      setBookChunks(chunks); // Update the bookChunks state
      console.log("First", chunks, "understanding every part");
      console.log(bookType);
      // setIsLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error.message);
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/api/books`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setBooks(data);
        setIsLoading(false);
        // Process the data as needed
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative">
      <Splide
        options={{
          rewind: true,
          gap: "1.5rem",
          arrows: false,
          perPage: 4,
          breakpoints: {
            768: {
              perPage: 2,
              gap: "1rem",
            },
          },
          perMove: 1,
          rewindByDrag: true,
          rewindSpeed: 1000,
          pagination: false,
          // drag: true,
          drag: "free",
        }}
        aria-label="My Favorite Images"
        className=""
      >
        <SplideSlide>
          <Slide
            handleClick={() => {
              getBooks("programming");
              setSelectedCategory("programming");
            }}
            type="programming"
            icon={
              <BiCodeAlt className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
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
              getBooks("religious");
              setSelectedCategory("religious");
            }}
            type="religious"
            icon={
              <GiLevelThreeAdvanced className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
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
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("fiction")}
            type="Fiction"
            icon={
              <BookOpen className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("non-fiction")}
            type="Non-Fiction"
            icon={
              <PencilRuler className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("Children/Adult")}
            type="Children/Adult"
            icon={
              <FaChildren className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("science/technology")}
            type="Sci/Tech"
            icon={
              <GrTechnology className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("politics/history")}
            type="History/Politics"
            icon={
              <MdChangeHistory className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("business/economics")}
            type="Biz/Economics"
            icon={
              <TbBusinessplan className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("cooking&food")}
            type="Food/Cooking"
            icon={
              <ChefHat className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("art_and_photography")}
            type="Art/Photograph"
            icon={
              <HiPhotograph className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("spirituality")}
            type="Spirituality"
            icon={
              <FaPlaceOfWorship className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("education and teaching")}
            type="Edu/Teaching"
            icon={
              <GiTeacher className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("Health and Wellness")}
            type="Health"
            icon={
              <HeartPulse className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("Philosophy")}
            type="Philosophy"
            icon={
              <IoLibrary className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
        <SplideSlide>
          <Slide
            handleClick={() => getBooks("parenting and family")}
            type="Parenting/Fam"
            icon={
              <MdFamilyRestroom className="w-[1.37906rem] h-[1.37906rem] md:w-[2.75rem] md:h-[2.75rem]" />
            }
          />
        </SplideSlide>
      </Splide>

      <div className="display p-2 book-container md:w-[95%] mx-auto md:flex justify-evenly">
        <div className="flex w-full md:w-1/2 justify-evenly">
          {books &&
            books.map((item, index) => (
              <Book
                key={index}
                bookId={item?.id}
                cover={item?.coverPic}
                title={item?.name}
                year={item?.releaseDate}
                author={item?.author}
                loading={loading}
              />
            ))}
          {/* {bookChunks &&
            bookChunks[0].map((item, index) => (
              <Book
                key={index}
                cover={item?.cover_i}
                title={item?.title}
                year={item?.first_publish_year}
                author={item?.author_name}
                loading={loading}
              />
            ))} */}
        </div>
        <div className="flex w-full md:w-1/2 justify-evenly">
          {/* {bookChunks &&
            bookChunks[1].map((item, index) => (
              <Book
                key={index}
                cover={item?.cover_i}
                title={item?.title?.trim().split(" ").slice(0, 2).join(" ")}
                year={item?.first_publish_year}
                author={item?.author_name}
                loading={loading}
              />
            ))} */}
        </div>
      </div>

      <div className="hidden p-2 md:flex justify-evenly md:w-[95%] mx-auto">
        {/* <div className="flex w-full md:w-1/2 justify-evenly">
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
        </div> */}
        {/* <div className="flex w-full md:w-1/2 justify-evenly">
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
        </div> */}
      </div>
      <Link
        to={`/category/${selectedCategory}`}
        className="my-[2px] roboto font-normal leading-normal text-[0.775rem] md:text-[1.5rem] capitalize text-style text-[#31af31] flex gap-[0.2rem] md:w-[9rem] absolute right-4 w-[6rem] md:right-9 links items-center"
      >
        <span className="underline">see more </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>
      <hr className=" h-[1px] mx-auto mt-[3rem] md:mt-[4rem] w-[90%] border-[#333] " />
    </div>
  );
};
