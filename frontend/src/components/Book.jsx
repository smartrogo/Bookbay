import React from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
export const Book = ({
  bookId,
  cover,
  title,
  year,
  author,
  loading,
  priceBuy,
  priceBorrow,
}) => {
  return (
    <Link
      style={{ pointerEvents: loading ? "none" : "" }}
      to={
        loading
          ? `/`
          : `/books/${bookId}?title=${title}&cover=${cover}&year=${year}&author=${author}&priceBuy=${priceBuy}&priceBorrow=${priceBorrow}`
      }
      className="w-full h-full"
    >
      <div className="h-[15rem] bd w-full text-center sm:h-[24rem] lg:h-[20rem] xl:h-[20rem] flex flex-col items-center justify-center">
        <div className="book flex items-center mb-3 justify-center w-[65%] lg:w-[55%] lg:h-[60%] rounded h-[60%] sm:h-[70%]">
          {loading ? (
            <div className="w-full fit mb-2">
              <Skeleton
                baseColor="#D9D9D9"
                height="100%"
                highlightColor="#c7c7c7"
                duration={3.5}
              />
            </div>
          ) : (
            <div className="h-full">
              <img
                src={`${cover}`}
                alt={title}
                className="object-scale-down h-full"
              />
            </div>
          )}
        </div>

        <span className="color text-xs md:text-sm mx-auto w-full md:w-[70%]">
          {loading ? (
            <Skeleton
              className="mb-[2px] mt-[8px] ske"
              baseColor="#D9D9D9"
              height="100%"
              highlightColor="#c7c7c7"
              duration={3.5}
            />
          ) : (
            <span className="color capitalize text-xs md:text-sm text-center mt-4 w-[90%]">
              {title}
            </span>
          )}
        </span>
        <span className="color text-xs md:text-sm mx-auto w-full md:w-[80%]">
          {loading ? (
            <Skeleton
              className="my-[4px] md:my-[2px] border-blue-50 ske2"
              baseColor="#D9D9D9"
              height="100%"
              highlightColor="#c7c7c7"
              duration={3.5}
            />
          ) : (
            <span className="color text-xs md:text-sm text-center mt-4 w-[90%]">
              {`year: ${year}`}
            </span>
          )}
        </span>
        <span className="color prev-text text-xs md:text-sm text-center w-full md:w-[80%]">
          {loading ? (
            <Skeleton
              className="ske3 md:h-[3rem] my-[4px] md:my-[2px]"
              baseColor="#D9D9D9"
              height="100%"
              highlightColor="#c7c7c7"
              duration={3.5}
            />
          ) : (
            <span className="prev-text">{author}</span>
          )}
        </span>
      </div>
    </Link>
  );
};
