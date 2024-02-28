import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Book } from "../components/Book";
import { UserContext } from "../UserContext";

import { Footer } from "../components/Footer";

const Discription = ({ title, body }) => {
  return (
    <div className="text-style text-start my-4 capitalize">
      <h2 className="text-[#00f] outfit text-[1.5rem] font-bold leading-normal ">
        {title}
      </h2>
      <p className="text-[#000] poppins text-[1rem] font-normal">{body}</p>
    </div>
  );
};

export const MyBooks = () => {
  const { userId } = useContext(UserContext);
  // const userId = "3a1vyPCDCAMYgDiL11ee";

  const [books, setBooks] = useState([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://bookbayapp.onrender.com/api/books/user/3a1vyPCDCAMYgDiL11ee`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setBooks(data.data);
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
    <div className="mt-20 h-screen">
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
        </div>
      </div>
      <Footer />
    </div>
  );
};
