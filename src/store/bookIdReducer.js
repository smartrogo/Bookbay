// bookIdReducer.js
const storedBookIds = localStorage.getItem("bookIds");
const initialState = storedBookIds ? JSON.parse(storedBookIds) : [];

const bookIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BOOK_ID":
    // eslint-disable-next-line no-case-declarations
      const updatedStateSet = [...state, action.payload];
      localStorage.setItem("bookIds", JSON.stringify(updatedStateSet));
      return updatedStateSet;
    case "REMOVE_BOOK_ID":
      // eslint-disable-next-line no-case-declarations
      const filteredState = state.filter((id) => id !== action.payload);
      localStorage.setItem("bookIds", JSON.stringify(filteredState));
      return filteredState;
    case "CLEAR_BOOK_ID":
      localStorage.removeItem("bookIds");
      return [];
    default:
      return state;
  }
};

export default bookIdReducer;
