import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Book } from '../components/Book';
import { Text } from '../components/Text';

const Categories = () => {
  // const navigate = useNavigate()  
  const { category } = useParams(); // Get the category from the URL
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchBooks = async () => {
        setLoading(true);
        const response = await fetch(
              `https://openlibrary.org/search.json?q=${category}`).catch((error) => {
                console.log.log("error", error)
              })
              const data = await response.json()
              const booksWithCovers = data.docs.filter((item) => item.cover_i);
              ((item) => item.cover_i);
              setBooks(booksWithCovers);
   setLoading(false);
      }
      fetchBooks();
    }, [category])

    const head = `${category} Books Categories`

  return (
    <div className='mt-20 h-[100%]'>
      <div className='mt-10 border-red-500 border-2'>
         <Text head={head} body="Discover Diverse Genres: Your Journey Through a World of Book Categories"/>
         </div>
      <div className="flex flex-wrap justify-center">
       
          {books.map((book, index) => (
            <div key={index} className="w-[50%] sm:w-1/2 md:w-1/4 lg:w-1/4 p-2">
              <Book
                cover={book.cover_i}
                title={book.title.trim().split(" ").slice(0, 2).join(" ")}
                year={book.first_publish_year}
                bookId={book.edition_key[0]}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Categories;
