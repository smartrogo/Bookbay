import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "../components/Button";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";

export const BookDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { title, author, cover, year } = Object.fromEntries(searchParams);
  console.log(title, author, cover, year, "det");
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("userData: ".userData);

  if (loading) {
    return (
      <div>
        <Skeleton height={250} width="100%" />
        <Skeleton height={20} width="80%" />
        <Skeleton height={20} width="50%" />
        <Skeleton height={20} width="70%" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const addToCart = async () => {
    if (userData && userData.email) {
      await addDoc(collection(db, "cart"), {
        email: userData.email,
        title,
        author,
        cover,
      });
      navigate("/protected");
    } else {
      // User is not logged in, redirect them to the login page
      navigate("/sign-in");
    }
  };

  return (
    <div className="book-details pt-20 h-screen">
      <h1>{userData.email}</h1>

      <div className="w-[80%] md:w-[90%] mx-auto flex flex-col md:flex-row md:gap-[2.375rem]" >

        <div className="flex justify-center items-center rounded-[1rem] bg-[#D9D9D9]">
        <img
          src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
          alt={title}
          className="w-[18.75rem] h-[18.75rem] object-scale-down"
        />
        </div>

      <div className="">
     <div className="my-4">
     <span className="text-[#000] outfit text-[2rem] font-semibold leading-normal font-style md:text-[3rem]"> {title}</span>
        <p className="capitalize text-[#000] text-[1rem] italic font-normal leading-normal md:text-[1.5rem]">Released - May 26, 2022</p>
        <span className="text-[#00f] text-[1rem] text-style font-normal leading-normal md:text-[1.25rem] ">{`by ${author} `} <span className="text-[#666]">(Author)</span></span><br/>
        <span className="text-[1rem] font-normal text-style md:text-[1.5rem]">5.0 <span className="text-[#DAA520]">★ ★ ★ ★ ★ </span>
 150 rating</span>
     </div>

     <hr className=" h-[0.0625rem] mx-auto my-[1rem] md:mt-[1rem] w-full border-[#000] " />

        <div className=" flex  justify-center md:justify-start gap-4 items-center text-[#000] leading-normal">
        <div className="capitalize border-2 border-solid border-[#000] rounded-[0.5rem] py-[0.5rem] px-[2rem] flex flex-col gap-[0.5rem] bg-[#fff7e1]">
          <span className="text-[1rem] text-style font-normal">buy</span>
          <span className="text-[1.25rem] font-bold">N2500</span>
        </div>
        <div className="capitalize border-2 border-solid border-[#000] rounded-[0.5rem] py-[0.5rem] px-[2rem] flex flex-col gap-[0.5rem] bg-[#D9FFF5]">
          <span className="text-[1rem] text-style font-normal">borrow</span>
          <span className="text-[1.25rem] font-bold">N2500</span>
        </div>
        </div>
        
        {/* <button onClick={() => addToCart()}>add to cart</button> */}

       <div className="flex items-center justify-center md:justify-start mt-10 mb-4">
       <Button value="Add To Cart"  cls_name="text-[1rem] font-bold btn md:text-[1rem] bg-[#0000FF] rounded-[0.25rem] md:rounded-[0.3125rem] text-[#FFFFFF] py-[0.5rem] px-[3rem] sm:py-[0.5rem] sm:px-[1rem] md:px-[1.25rem] poppins text-center text-style capitalize md:py-[0.625rem] text-center flex items-center px-4 leading-[1.23713rem] md:leading[0.62181rem]" onClick={() => addToCart()}/>
        
       </div>
      </div>
      </div>
      <hr className=" h-[0.0625rem] mx-auto my-[1rem] md:mt-[4rem] w-[90%] border-[#000] " />

      <div className="leading-normal w-[90%] mx-auto">
        <h1 className="text-[1.5rem] text-style font-bold capitalize">Description: </h1>
        <p className="text-[1rem] text-style font-normal">
        "The Philosophy of Money" is a seminal work written by German sociologist and philosopher Georg Simmel in 1900. This book explores the intricate relationship between money and society, delving into the profound impact that money has on human behavior, culture, and social structures.
Simmel's work goes beyond the mere economic aspects of money and delves into its philosophical and sociological dimensions. He argues that money is not merely a medium of exchange or a unit of value but a powerful force that shapes human interactions and social dynamics. Simmel explores how money can both connect and isolate individuals, how it influences our perception of value and worth, and how it can lead to a range of social phenomena, from individualism to social stratification. 
        </p> <Link className="text-[#004E7C] font-semibold">Read more</Link>
      </div>
      <hr className=" h-[0.0625rem] mx-auto my-[1rem] md:mt-[4rem] w-[90%] border-[#000] " />
      <div className="mx-auto w-[90%] ">
        <div className="  w-full md:w-1/2">
        <textarea
                id="message"
                name="message"
                className="w-full my-4 bg-[#eee] rounded-[0.29656rem] md:rounded-[0.5rem] focus:border-[#4b4be6] focus:ring-[2px] focus:ring-[#9a9ae6] h-32 text-base outline-none text-[#696969] py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                placeholder="Write Your Comment"
              ></textarea>

<Button
              type="submit"
              value="submit"
              cls_name={
                loading
                  ? "mx-auto rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#fff] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize"
                  : "bg-transparent border-[2px] border-solid border-[#00f] mx-auto btn rounded-[0.29656rem] md:rounded-[0.5rem] py-[0.37069rem] px-[0.92675rem] md:py-[0.625rem] md:px-[1.5625rem] text-center text-[#00f] poppins text-[0.66725rem] md:text-[1.125rem] text-style leading-normal font-normal capitalize"
              }
            />
        </div>
      </div>

      <Footer />
    </div>
  );
};
