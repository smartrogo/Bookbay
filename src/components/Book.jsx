import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
export const Book = ({ bookId, cover, title, year, autor, loading }) => {
  console.log(loading, "hy men where are you")
  return (
    <Link to={`/books/${bookId}`} className="w-full h-full">
      <div className="h-[15rem] m-2 bd w-full sm:h-[24rem] lg:h-[20rem] xl:h-[20rem] flex flex-col items-center justify-center ">
        <div className="book flex items-center justify-center w-[65%] lg:w-[55%] lg:h-[60%] h-[60%] sm:h-[70%]">
          {loading ? (
            <div className="w-full">
              <Skeleton
              baseColor="#202020"
              height={100}
              highlightColor="#444"
              className="border-2 border-yellow-500 w-ful"
            />
            </div>
          ) : (
            <div className="h-full">
              <img
                src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
                alt={title}
                className="object-scale-down h-full "
              />
            </div>
          )}
        </div>

        {loading ? (
          <div>
          <Skeleton style={{width: "100%"}} width="100px" className="border-2 border-blue-500" baseColor="#202020" highlightColor="#444" />
          </div>
        ) : (
          <span className="color text-xs md:text-sm text-center mt-4 w-[90%]">
            {title}
          </span>
        )}
        <span className="color text-xs md:text-sm">
          {loading ? (
            <Skeleton width="100%" baseColor="#202020" highlightColor="#444" />
          ) : (
            `year: ${year}`
          )}
        </span>
        <span className="color text-xs md:text-sm text-center w-full md:w-[80%]">
          {loading ? (
            <Skeleton width="100%" baseColor="#202020" highlightColor="#444" />
          ) : (
            autor
          )}
        </span>
      </div>
    </Link>
  );
};
