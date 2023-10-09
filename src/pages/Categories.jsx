import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Book } from "../components/Book";
import { Text } from "../components/Text";
import SearchInput from "../components/SearchInput";
import { Footer } from "../components/Footer";

const Categories = () => {
  // const navigate = useNavigate()
  const { category } = useParams(); // Get the category from the URL
  const [books, setBooks] = useState([]); // Initialize with an empty array
  const [searchedBooks, setSearchBooks] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParam] = useSearchParams({ q: "" });
  const q = searchParams.get("q");
  // const [searchValue, setSearchValue] = useState(() => (q ? q : ""));

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
    });
    const data = await response.json();
    testing(data);
    setLoading(false);
    console.log(loading, "loading off");
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

  const head = `${category} Books Categories`;
  const getIsbn = (isbn) => {
    console.log("this is this books isbn's: ", typeof isbn);
    return isbn ? isbn[0] : "";
  };
  return (
    <div className="mt-20">
      <div className="mt-10 border-red-500 border-2 flex flex-col justify-center items-center">
        <Text
          head={head}
          body="Discover Diverse Genres: Your Journey Through a World of Book Categories"
        />

        <SearchInput
          placeholder="Search..."
          value={q ? q : ""}
          onChange={(e) => search(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap justify-center">
        {searchedBooks.map((book, index) => (
          <div key={index} className="w-[50%] sm:w-1/2 md:w-1/4 lg:w-1/4 p-2">
            <Book
              cover={book?.cover_i}
              title={book?.title?.trim().split(" ").slice(0, 2).join(" ")}
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
