// bookIdReducer.js
const initialState = localStorage.getItem("bookId")
  ? JSON.parse(localStorage.getItem("bookId"))
  : [];

const bookIdReducer = (state = initialState, action) => {
  let updatedState;
  switch (action.type) {
    case "SET_BOOK_ID":
      updatedState = [...state, action.payload];
      localStorage.setItem("bookId", JSON.stringify(updatedState));
      return updatedState;
    case "CLEAR_BOOK_ID":
      localStorage.removeItem("bookId");
      return [];
    default:
      return state;
  }
};

export default bookIdReducer;
