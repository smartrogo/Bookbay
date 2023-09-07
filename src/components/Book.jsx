import React from "react";
import Skeleton from "react-loading-skeleton";

export const Book = ({ cover, title, year, autor, loading }) => {
  return (
    <div className="h-[15rem] bd w-full sm:h-[24rem] lg:h-[30rem] xl:h-[20rem] flex flex-col items-center justify-center ">
      <div className="book flex items-center justify-center w-[65%] lg:w-[70%] lg:h-[60%] h-[60%] sm:h-[70%]">
        {loading ? (
          <Skeleton height={250} width="100%" baseColor="#202020" highlightColor="#444"/>
          
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
      <span className="color text-center mt-6 w-[80%]">{loading ? <Skeleton width="100%" baseColor="#202020" highlightColor="#444"/> : title}</span>
      <span>{loading ? <Skeleton width="100%" baseColor="#202020" highlightColor="#444"/> : autor}</span>
      <span>{loading ? <Skeleton width="100%" baseColor="#202020" highlightColor="#444"/>: `year: ${year}` }</span>
    </div>
  );
};
