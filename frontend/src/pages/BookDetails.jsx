import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { AuthContext } from "../AuthContext";
import { Footer } from "../components/Footer";
import { LoadingBtn } from "../components/LoadingBtn";
import { cartItems } from "../store/cartAtoms";
import { BookContext } from "../BookContext";
import { useAtom } from "jotai";
import { useDispatch } from "react-redux";
import { setBookId } from "../store/actions/bookAction";
import { fetchBookById, addBookToCart } from "../services/bookService";
import { useToast } from "../ToastContext";

export const BookDetails = () => {
  const { setBooksId } = useContext(BookContext);
  const [book, setBook] = useState({});
  const [priceBuy, setPriceBuy] = useState(0);
  const [priceBorrow, setPriceBorrow] = useState(0);
  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [displayUser, setDisplayUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setCartAtom] = useAtom(cartItems);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { bookId } = useParams();
  const dispatch = useDispatch();

  const { title: titleParam, author: authorParam, cover: coverParam, year: yearParam } = Object.fromEntries(searchParams);
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookId) return;
    setBooksId(bookId);
    setLoading(true);

    const fetchData = async () => {
      try {
        const bookData = await fetchBookById(bookId);
        setBook(bookData);
        setPriceBorrow(bookData.priceBorrow || 0);
        setPriceBuy(bookData.priceBuy || 0);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, setBooksId]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const currentUserId = userData?.id || userData?.userId;
  const title = book.title || titleParam || "Unknown title";
  const author = book.author || authorParam || "Unknown author";
  const cover = book.cover || coverParam || "";
  const year = book.year || yearParam || "N/A";

  const { showToast } = useToast();

  const addToCart = async () => {
    setLoading(true);

    if (!currentUserId) {
      navigate(`/sign-in?next=/books/${bookId}`);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        bookId,
        title,
        author,
        cover,
        year,
        priceBuy: book.priceBuy || priceBuy,
        priceBorrow: book.priceBorrow || priceBorrow,
      };

      const cartItem = await addBookToCart(currentUserId, payload);

      dispatch(setBookId(bookId.toString()));
      setCartAtom((old) => [
        ...old,
        {
          ...cartItem,
          title: payload.title,
          author: payload.author,
          cover: payload.cover,
          priceBuy: payload.priceBuy,
          priceBorrow: payload.priceBorrow,
        },
      ]);
      navigate("/cart");
    } catch (addError) {
      console.error("Error adding book to cart:", addError);
      showToast("Failed to add book to cart. Please try again.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleTextSubmit = () => {
    setDisplayText(inputText);
    setInputText("");
    setDisplayUser(true);
  };

  return (
    <div className="book-details pt-20 h-screen mt-4">
      <div className="w-[80%] md:w-[90%] mx-auto flex flex-col md:flex-row md:gap-[2.375rem]">
        <div className="flex justify-center items-center rounded-[1rem] bg-[#D9D9D9]">
          <img src={cover} alt={title} className="w-[18.75rem] h-[18.75rem] object-scale-down" />
        </div>

        <div className="">
          <div className="my-4">
            <span className="text-[#000] outfit text-[2rem] font-semibold leading-normal font-style md:text-[3rem]">
              {title}
            </span>
            <p className="capitalize text-[#000] text-[1rem] italic font-normal leading-normal md:text-[1.5rem]">
              Released - {year}
            </p>
            <span className="text-[#00f] text-[1rem] text-style font-normal leading-normal md:text-[1.25rem] ">
              {`by ${author}`} <span className="text-[#666]">(Author)</span>
            </span>
            <br />
            <span className="text-[1rem] font-normal text-style md:text-[1.5rem]">
              5.0 <span className="text-[#DAA520]">★ ★ ★ ★ ★ </span>
              150 rating
            </span>
          </div>

          <hr className="h-[0.0625rem] mx-auto my-[1rem] md:mt-[1rem] w-full border-[#000] " />

          <div className="flex justify-center md:justify-start gap-4 items-center text-[#000] leading-normal">
            <div className="capitalize border-2 border-solid border-[#000] rounded-[0.5rem] py-[0.5rem] px-[2rem] flex flex-col gap-[0.5rem] bg-[#fff7e1]">
              <span className="text-[1rem] text-style font-normal">buy</span>
              <span className="text-[1.25rem] font-bold">N{book.priceBuy || priceBuy}</span>
            </div>
            <div className="capitalize border-2 border-solid border-[#000] rounded-[0.5rem] py-[0.5rem] px-[2rem] flex flex-col gap-[0.5rem] bg-[#D9FFF5]">
              <span className="text-[1rem] text-style font-normal">borrow</span>
              <span className="text-[1.25rem] font-bold">N{book.priceBorrow || priceBorrow}</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start mt-10 mb-4">
            {loading ? (
              <LoadingBtn
                value="Adding"
                loading={loading}
                cls_name="text-[1rem] font-bold btn md:text-[1rem] bg-[#2424ff] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[3rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
              />
            ) : (
              <Button
                value="Add To Cart"
                cls_name="text-[1rem] font-bold btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[3rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
                onClick={addToCart}
              />
            )}
          </div>
        </div>
      </div>

      <hr className="h-[0.0625rem] mx-auto my-[1rem] md:mt-[4rem] w-[90%] border-[#000] " />

      <div className="leading-normal w-[90%] mx-auto">
        <h1 className="text-[1.5rem] text-style font-bold capitalize">Description:</h1>
        <p className="text-[1rem] text-style font-normal">{book.description}</p>
      </div>

      <div className="leading-normal w-[90%] mx-auto my-8">
        <h1 className="text-[1.5rem] text-style font-bold capitalize my-4">Reviews</h1>
        <p className="text-[1rem] text-style font-normal capitalize mb-6">{displayText}</p>

        <div className="flex items-center mt-4 gap-4">
          <div>
            {displayUser && userData?.pic ? (
              <img src={userData.pic} alt="profile" className="w-10 h-10 rounded-full" />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${userData?.email?.split("@")[0]?.slice(0, 2)}`}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            )}
          </div>

          <div>
            {displayUser && (
              <p className="text-[1.125rem] font-bold text-style capitalize text-[#000]">
                {userData.email || userData.displayName}
              </p>
            )}
          </div>
        </div>
      </div>

      <hr className="h-[0.0625rem] mx-auto my-[1rem] md:mt-[4rem] w-[90%] border-[#000] " />

      <div className="mx-auto w-[90%] ">
        <div className="w-full md:w-1/2">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            id="message"
            name="message"
            className="w-full my-4 bg-[#eee] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] h-32 text-base outline-none text-[#696969] py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            placeholder="Write Your Comment"
          ></textarea>
          <Button
            onClick={handleTextSubmit}
            value="Submit"
            cls_name="text-[1rem] font-bold btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[3rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};
