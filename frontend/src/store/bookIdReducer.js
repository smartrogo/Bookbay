const storedBookIds = localStorage.getItem("bookIds");
const initialState = storedBookIds ? JSON.parse(storedBookIds) : [];

// Ensure all initial values are strings
const parsedInitialIds = initialState.map((id) => id.toString());

const bookIdReducer = (state = parsedInitialIds, action) => {
  switch (action.type) {
    case "SET_BOOK_ID":
      // eslint-disable-next-line no-case-declarations
      const updatedStateSet = [...state, action.payload.toString()];
      localStorage.setItem("bookIds", JSON.stringify(updatedStateSet));
      return updatedStateSet;
    case "REMOVE_BOOK_ID":
      console.log("Current state:", state);
      console.log("ID to remove:", action.payload);
      // eslint-disable-next-line no-case-declarations
      const filteredState = state.filter((id) => id !== action.payload);
      console.log("Filtered state:", filteredState);
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
