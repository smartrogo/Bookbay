import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "../components/Button";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { LoadingBtn } from "../components/LoadingBtn";
import { cartItems } from "../components/Header";
import { useAtom } from "jotai";

export const BookDetails = () => {
  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [displayUser, setDisplayUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartAtom, setCartAtom] = useAtom(cartItems);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { title, author, cover, year } = Object.fromEntries(searchParams);
  console.log(title, author, cover, year, "det");
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("userData: ".userData);

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const addToCart = async () => {
    setLoading(true);
    console.log("loading...");
    if (userData && userData.email) {
      await addDoc(collection(db, "cart"), {
        email: userData.email,
        title,
        author,
        cover,
      }).then((res) => {
        console.log("resss", res.id);

        setCartAtom((old) => [
          ...old,
          { email: userData.email, title, author, cover },
        ]);
        navigate("/cart");
      });
    } else {
      // User is not logged in, redirect them to the login page
      navigate("/sign-in");
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
  console.log(userData);

  return (
    <div className="book-details pt-20 h-screen">
      <h1>{userData.email || userData.displayName}</h1>

      <div className="w-[80%] md:w-[90%] mx-auto flex flex-col md:flex-row md:gap-[2.375rem]">
        <div className="flex justify-center items-center rounded-[1rem] bg-[#D9D9D9]">
          <img
            src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
            alt={title}
            className="w-[18.75rem] h-[18.75rem] object-scale-down"
          />
        </div>

        <div className="">
          <div className="my-4">
            <span className="text-[#000] outfit text-[2rem] font-semibold leading-normal font-style md:text-[3rem]">
              {" "}
              {title}
            </span>
            <p className="capitalize text-[#000] text-[1rem] italic font-normal leading-normal md:text-[1.5rem]">
              Released - May 26, 2022
            </p>
            <span className="text-[#00f] text-[1rem] text-style font-normal leading-normal md:text-[1.25rem] ">
              {`by ${author} `} <span className="text-[#666]">(Author)</span>
            </span>
            <br />
            <span className="text-[1rem] font-normal text-style md:text-[1.5rem]">
              5.0 <span className="text-[#DAA520]">★ ★ ★ ★ ★ </span>
              150 rating
            </span>
          </div>

          <hr className=" h-[0.0625rem] mx-auto my-[1rem] md:mt-[1rem] w-full border-[#000] " />

          <div className=" flex  justify-center md:justify-start gap-4 items-center text-[#000] leading-normal">
            <div className="capitalize border-2 border-solid border-[#000] rounded-[0.5rem] py-[0.5rem] px-[2rem] flex flex-col gap-[0.5rem] bg-[#fff7e1]">
              <span className="text-[1rem] text-style font-normal">buy</span>
              <span className="text-[1.25rem] font-bold">$2500</span>
            </div>
            <div className="capitalize border-2 border-solid border-[#000] rounded-[0.5rem] py-[0.5rem] px-[2rem] flex flex-col gap-[0.5rem] bg-[#D9FFF5]">
              <span className="text-[1rem] text-style font-normal">borrow</span>
              <span className="text-[1.25rem] font-bold">$2500</span>
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
                onClick={() => addToCart()}
              />
            )}
          </div>
        </div>
      </div>
      <hr className=" h-[0.0625rem] mx-auto my-[1rem] md:mt-[4rem] w-[90%] border-[#000] " />

      <div className="leading-normal w-[90%] mx-auto">
        <h1 className="text-[1.5rem] text-style font-bold capitalize">
          Description:{" "}
        </h1>
        <p className="text-[1rem] text-style font-normal">
          "The Philosophy of Money" is a seminal work written by German
          sociologist and philosopher Georg Simmel in 1900. This book explores
          the intricate relationship between money and society, delving into the
          profound impact that money has on human behavior, culture, and social
          structures. Simmel's work goes beyond the mere economic aspects of
          money and delves into its philosophical and sociological dimensions.
          He argues that money is not merely a medium of exchange or a unit of
          value but a powerful force that shapes human interactions and social
          dynamics. Simmel explores how money can both connect and isolate
          individuals, how it influences our perception of value and worth, and
          how it can lead to a range of social phenomena, from individualism to
          social stratification.
        </p>{" "}
        <Link className="text-[#004E7C] font-semibold">Read more</Link>
      </div>

      <div className="leading-normal w-[90%] mx-auto my-8">
        <h1 className="text-[1.5rem] text-style font-bold capitalize my-4">
          Reviews{" "}
        </h1>
        <p className="text-[1rem] text-style font-normal capitalize">
          {displayText}

          <div className="flex items-center mt-4 gap-4">
            <div>
              {displayUser && userData?.pic ? (
                <img
                  src={userData?.pic}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${userData?.email
                    ?.split("@")[0]
                    ?.slice(0, 2)}`}
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
        </p>
      </div>

      <hr className=" h-[0.0625rem] mx-auto my-[1rem] md:mt-[4rem] w-[90%] border-[#000] " />
      <div className="mx-auto w-[90%] ">
        <div className="  w-full md:w-1/2">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            id="message"
            name="message"
            className="w-full my-4 bg-[#eee] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] h-32 text-base outline-none text-[#696969] py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            placeholder="Write Your Comment"
          ></textarea>
          <Button
            //  type="submit"
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
