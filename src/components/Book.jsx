import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
export const Book = ({ bookId, cover, title, year, author, loading }) => {
  
    // Calculate the dimensions of the book container
    const containerStyle = {
      width: "100%", // Set the width to 100% of the container
      height: "auto", // Set the height to auto for dynamic sizing
    };
  return (
    <Link to={`/books/${bookId}`} className="w-full h-full">
      <div className="h-[15rem] m-2 bd w-full text-center sm:h-[24rem] lg:h-[20rem] xl:h-[20rem] flex flex-col items-center justify-center ">


        <div className="book flex items-center mb-4 justify-center w-[65%] lg:w-[55%] lg:h-[60%] h-[60%] sm:h-[70%]">
          {loading ? (
            <div className="w-full fit">
              <Skeleton
              baseColor="#D9D9D9"
              height="100%"
              highlightColor="#fcfcfc"
            />
            </div>
          ) : (
            <div className="h-full">
              <img
                src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
                alt={title}
                className="object-scale-down h-full"
              />
            </div>
          )}
        </div>

        

        <span className="color text-xs md:text-sm mx-auto w-full md:w-[70%]">
          {loading ? (
          <Skeleton className="mb-[4px] mt-[8px] ske" baseColor="#D9D9D9" highlightColor="#fcfcfc" />
          ) : (
            <span className="color text-xs md:text-sm text-center mt-4 w-[90%]">
            {title}
            </span>
          )}
        </span>
        <span className="color text-xs md:text-sm mx-auto w-full md:w-[80%]">
          {loading ? (
          <Skeleton className="my-[4px] md:my-[2px] border-blue-50 ske2" baseColor="#D9D9D9" highlightColor="#fcfcfc" />
          ) : (
            <span className="color text-xs md:text-sm text-center mt-4 w-[90%]">
            {`year: ${year}`}
            </span>
          )}
        </span>
        <span className="color text-xs md:text-sm text-center w-full md:w-[80%]">
          {loading ? (
            <Skeleton baseColor="#D9D9D9" className="ske3 md:h-[3rem] my-[4px] md:my-[2px]" highlightColor="#fcfcfc" />
          ) : (
            author[0]
          )}
        </span>
      </div>
    </Link>
  );
};
