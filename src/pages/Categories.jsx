import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Book } from '../components/Book';
import { Text } from '../components/Text';
import SearchInput from '../components/SearchInput';

const Categories = () => {
  // const navigate = useNavigate()  
  const { category } = useParams(); // Get the category from the URL
  const [books, setBooks] = useState([]); // Initialize with an empty array
  const [loading, setLoading] = useState(true);

  const testing = (data) => {
    return data.docs.filter((item) => item.cover_i);
  }

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${category}`);
        const data = await response.json();
        setBooks(testing(data));
        setLoading(false);
        console.log(books)
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [category]);

  const head = `${category} Books Categories`;

  return (
    <div className='mt-20'>
      <div className='mt-10 border-red-500 border-2 flex flex-col justify-center items-center'>
        <Text head={head} body="Discover Diverse Genres: Your Journey Through a World of Book Categories" />

      <SearchInput placeholder="Search..."/>

      </div>
      <div className="flex flex-wrap justify-center">
        {books.map((book, index) => (
          <div key={index} className="w-[50%] sm:w-1/2 md:w-1/4 lg:w-1/4 p-2">
            <Book
              cover={book.cover_i}
              title={book.title.trim().split(" ").slice(0, 2).join(" ")}
              year={book.first_publish_year}
              bookId={book.edition_key[0]}
              loading={loading}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
