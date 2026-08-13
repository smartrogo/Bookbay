import React, { createContext, useState } from "react";

export const BookContext = createContext(null);

export const BookProvider = ({ children }) => {
  const [booksId, setBooksId] = useState(null);

  const contextData = {
    booksId,
    setBooksId,
  };

  return (
    <BookContext.Provider value={contextData}>{children}</BookContext.Provider>
  );
};
