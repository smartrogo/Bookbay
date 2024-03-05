export const setBookId = (bookId) => {
  return {
    type: "SET_BOOK_ID",
    payload: bookId,
  };
};

export const clearBookId = () => {
  return {
    type: "CLEAR_BOOK_ID",
  };
};
