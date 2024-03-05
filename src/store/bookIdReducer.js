// bookIdReducer.js
const initialState = localStorage.getItem("bookId") || null;

const bookIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BOOK_ID":
      localStorage.setItem("bookId", action.payload);
      return action.payload;
    case "CLEAR_BOOK_ID":
      localStorage.removeItem("bookId");
      return null;
    default:
      return state;
  }
};

export default bookIdReducer;
