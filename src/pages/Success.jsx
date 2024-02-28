import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BookContext } from "../BookContext";
import { AuthContext } from "../AuthContext";
import { UserContext } from "../UserContext";

import { Footer } from "../components/Footer";

import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

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

export const Success = () => {
  const { booksId } = useContext(BookContext);
  const { userId } = useContext(UserContext);
  //  const userId = "7We2EnhANeS5DQBPimbf";
  //  const bookId = "HGt99ThURxEhOHMqRq1L";
  const location = useLocation();
  const navigate = useNavigate();
  const [ref, setRef] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get("reference");
    setRef(reference);
  }, [location.search]);

  if (!ref) {
    navigate("/");
    return;
  }

  if (ref) {
    axios
      .get(
        `https://bookbayapp.onrender.com/api/createPayment/${userId}/${booksId}?reference=${ref}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setResponse("Purchase Succesfully");
        } else {
          setResponse("Not Successfully");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="mt-20 h-screen">
      <div className="p-4 w-[100%] md:w-[85%] mx-auto">
        <Discription title="Book Purchase Successfully" body="Go to my book" />
      </div>

      <Link
        to={`/my-books`}
        className="my-[2px] roboto font-normal leading-normal text-[0.775rem] md:text-[1.5rem] capitalize text-style text-[#31af31] flex gap-[0.2rem] md:w-[9rem] absolute right-4 w-[6rem] md:right-9 links items-center"
      >
        <span className="underline">My Books </span>
        <LiaLongArrowAltRightSolid className="w-[1.5rem] mt-1" />
      </Link>

      <Footer />
    </div>
  );
};
