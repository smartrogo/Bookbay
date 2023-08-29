import React from "react";

export const Book = ({ cover, title, rate, autor }) => {
  return (
    <div className="h-[200px] border-red-500 border-2 flex flex-col items-center justify-center my-[2rem] md:my-[4rem]">
      <div className="book w-[10.68813rem] h-[10.75rem] rounded-[1rem]">
        {cover ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
            alt={title}
            className="rounded-[1rem] object-cover w-[10.68813rem] h-[10.75rem]"
          />
        ) : (
          <p>No cover available</p>
        )}
      </div>
      <span className="color border-2 text-center my-2 w-[80%]">{title}</span>
      <span>{rate}</span>
      <span>{autor}</span>
    </div>
  );
};
