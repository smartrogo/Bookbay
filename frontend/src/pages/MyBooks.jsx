import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "../components/Book";
import { Footer } from "../components/Footer";
import { AuthContext } from "../AuthContext";
import { fetchUserBooks } from "../services/bookService";

export const MyBooks = () => {
  const { userData, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuth) {
      navigate("/sign-in?next=/my-books");
      return;
    }

    const loadUserBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchUserBooks(userData?.id || userData?.userId);
        const booksData = response.books || response.data || response;
        setBooks(booksData || []);
      } catch (fetchError) {
        console.error("Unable to load user books:", fetchError);
        setError(fetchError?.message || "Unable to load your books.");
      } finally {
        setLoading(false);
      }
    };

    loadUserBooks();
  }, [isAuth, navigate, userData]);

  return (
    <div className="mt-20 min-h-screen">
      <div className="display p-2 book-container md:w-[95%] mx-auto md:flex justify-evenly">
        <div className="flex w-full md:w-1/2 justify-evenly">
          {loading ? (
            <div>Loading your books...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : books.length === 0 ? (
            <div className="text-gray-600">No books found in your library yet.</div>
          ) : (
            books.map((item, index) => (
              <Book
                key={item?.id || index}
                bookId={item?.id}
                cover={item?.coverPic || item?.cover}
                title={item?.name || item?.title}
                year={item?.releaseDate || item?.year}
                author={item?.author}
                loading={loading}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
