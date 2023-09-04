import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Book } from "./Book";
import Skeleton from "react-loading-skeleton";

const Categories = () => {
  const { category } = useParams(); // Get the category from the URL
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(category)

  useEffect(() => {
    // Fetch books based on the category parameter
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${category}`
        );
        const data = await response.json();
        console.log(data);
        const booksWithCovers = data.docs.filter((item) => item.cover_i);
        setBooks(booksWithCovers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  return (
    <div className='mt-20 '>
      <h2>Books in the {category} category</h2>
      <div className="flex flex-wrap justify-center">
        {loading ? (
          // Display a loading skeleton while fetching data
          Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} height={250} width="100%" />
          ))
        ) : (
          // Display books once data is loaded
          books.map((book, index) => (
            <Book
              key={index}
              cover={book.cover_i}
              title={book.title.trim().split(" ").slice(0, 2).join(" ")}
              year={book.first_publish_year}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Categories;
