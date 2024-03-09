export const setBookId = (bookId) => {
  return {
    type: "SET_BOOK_ID",
    payload: bookId,
  };
};

export const removeBookId = (id) => {
  return {
    type: "REMOVE_BOOK_ID",
    payload: id,
  };
};
export const clearBookId = () => {
  return {
    type: "CLEAR_BOOK_ID",
  };
};
