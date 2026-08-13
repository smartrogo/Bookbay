import { createStore } from "redux";
import rootReducer from "./reducers";

const storedBookIds = localStorage.getItem("bookIds");
const initialBookIds = storedBookIds ? JSON.parse(storedBookIds) : [];

const initialState = {
  userId: localStorage.getItem("userId") || null,
  bookId: Array.isArray(initialBookIds) ? initialBookIds : [],
};

const store = createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
