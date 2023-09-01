import React from "react";
import Skeleton from "react-loading-skeleton";

export const Book = ({ cover, title, year, autor, loading }) => {
  return (
    <div className="h-[25rem] w-full sm:h-[35rem] lg:h-[30rem] xl:h-[30rem] border-red-500 border-2 flex flex-col items-center justify-center my-[1rem] py-2 sm:py-[1rem] md:my-[4rem] lg:my-[1rem]">
      <div className="book w-[90%] lg:w-[70%] h-[80%] border-2 border-blue-500 sm:h-[80%] rounded-[1rem]">
        {loading ? (
          <Skeleton height={250} width="100%" baseColor="#202020" highlightColor="#444"/>
          
        ) : (
          <img
          src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
          alt={title}
          className="object-cover lg:object-scale-down h-full w-full"
        />
        )}
      </div>
      <span className="color border-2 text-center my-2 w-[80%]">{loading ? <Skeleton width="100%" baseColor="#202020" highlightColor="#444"/> : title}</span>
      <span>{loading ? <Skeleton width="100%" baseColor="#202020" highlightColor="#444"/> : autor}</span>
      <span>{loading ? <Skeleton width="100%" baseColor="#202020" highlightColor="#444"/>: `year: ${year}` }</span>
    </div>
  );
};
