
// types
export const SET_BOOK_ID = "@book/SET_BOOK_ID";

// action creator
export const setBookId = (bookId) => ({
  type: SET_BOOK_ID,
  payload: { bookId },
});

// reducer
const initialState = {
  bookId: null,
};

const setBookIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOOK_ID:
      return {
        ...state,
        bookId: action.payload.bookId,
      };
    default:
      return state;
  }
};

export default setBookIdReducer;
