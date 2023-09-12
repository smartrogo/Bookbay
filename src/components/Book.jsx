import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
export const Book = ({bookId, cover, title, year, autor, loading }) => {
  return (
    <Link to={`/books/${bookId}`} className="w-full h-full">

    <div className="h-[15rem] m-2 bd w-full sm:h-[24rem] lg:h-[20rem] xl:h-[20rem] flex flex-col items-center justify-center ">
        <div className="book flex items-center justify-center w-[65%] lg:w-[55%] lg:h-[60%] h-[60%] sm:h-[70%]">
          {loading ? (
            <Skeleton
              height={250}
              width="100%"
              baseColor="#202020"
              highlightColor="#444"
            />
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
      <span className="color text-xs md:text-sm text-center mt-4 w-[90%]">
        {loading ? (
          <Skeleton width="100%" baseColor="#202020" highlightColor="#444" />
        ) : (
          title
        )}
      </span>
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
