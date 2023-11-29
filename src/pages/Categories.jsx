import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Book } from "../components/Book";
import { Text } from "../components/Text";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/skyblue";
import { Slide } from "../components/Slide";
import "@splidejs/react-splide/css/sea-green";
import SearchInput from "../components/SearchInput";
import { Footer } from "../components/Footer";
import { BiCodeAlt } from "react-icons/bi";
import { MdHistoryEdu } from "react-icons/md";
import { FaComputer } from "react-icons/fa6";
import { BiBookBookmark } from "react-icons/bi";
import { GiLevelThreeAdvanced } from "react-icons/gi";
import { GiMaterialsScience } from "react-icons/gi";
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
import "react-loading-skeleton/dist/skeleton.css";
const Categories = () => {
  // const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("programming");
  const { category } = useParams(); // Get the category from the URL
  const [books, setBooks] = useState([]); // Initialize with an empty array
  const [searchedBooks, setSearchBooks] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParam] = useSearchParams({ q: "" });
  const [me, setMe] = useState("")
  const q = searchParams.get("q");
  // const [searchValue, setSearchValue] = useState(() => (q ? q : ""));
  // const [loading, setIsLoading] = useState(true);

  
  useEffect(() => {
    getBooks("programming"); // Fetch programming books initially
  }, []);


  const testing = (data) => {
    let filtered_data = data.docs.filter((item) => item.cover_i);
    console.log("filtered_data: ", filtered_data);
    return loadBooks(q, filtered_data);
  };

  const fetchBooks = async () => {
    setLoading(true);
    console.log(loading, "loading.....");
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${category}`
    ).catch((error) => {
      console.log("error in catch: ", error);
      console.log(category);
    });
    const data = await response.json();
    testing(data);
    setLoading(false);
    console.log(loading, "loading off");
  };

  const getBooks = async (bookType) => {
    try {
      setLoading(true);
      // Api endpoint
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${bookType}`
      );
      const data = await response.json();
      // Filter the data and get books with cover image
      const types = bookType
      console.log(types);
      setMe(bookType)
      const booksWithCovers = data.docs.filter((item) => item.cover_i);
      // Get the first eight books to be displayed
      const initialAuthor = booksWithCovers.map((item) => item.author_name[0]);
      // console.log(initialAuthor, "authors")
      setBooks(booksWithCovers);
      setSearchBooks(booksWithCovers);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching books: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("query: ", q);
    fetchBooks();
    return () => {};
  }, []);

  const loadBooks = (val, data) => {
    console.log("doing so may: ", books);
    setBooks(data);
    if (!val) {
      console.log("books: ", data, books);
      setSearchBooks(data);
      setSearchParam({ q: "" });
    } else {
      setSearchParam({ q: val });
      let result = data.filter((item) =>
        item.title?.toLowerCase().includes(val.toLocaleLowerCase())
      );
      console.log("result: ", result);
      setSearchBooks(result);
    }
  };

  const search = (val) => {
    console.log("val:", val, "books: ", books);
    setSearchParam({ q: val });
    let result = books.filter((item) =>
      item.title?.toLowerCase().includes(val.toLocaleLowerCase())
    );
    console.log("result: ", result);
    setSearchBooks(result);
  };

  const head = `${me} Books Categories`;
  const getIsbn = (isbn) => {
    console.log("this is this books isbn's: ", typeof isbn);
    return isbn ? isbn[0] : "";
  };
  return (
    <div className="mt-20">
      <div className="mt-10 flex border-2 capitalize flex-col justify-center items-center">
        <Text
          head={head}
          body="Discover Diverse Genres: Your Journey Through a World of Book Categories"
        />

        <SearchInput
          placeholder="Search..."
          value={q ? q : ""}
          onChange={(e) => search(e.target.value)}
          loading={loading}
        />
      </div>

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
        className=" overflow-x-hidden"
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
              getBooks("computer+science");
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

      <div className="flex flex-wrap justify-center">
        {searchedBooks.map((book, index) => (
          <div key={index} className="w-[50%] sm:w-1/2 md:w-1/4 lg:w-1/4 p-2">
            <Book
              cover={book?.cover_i}
              title={book?.title}
              year={book?.first_publish_year}
              bookId={getIsbn(book.isbn)}
              loading={loading}
            />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Categories;
