import { combineReducers } from "redux";
import userIdReducer from "./userIdReducer";
import bookIdReducer from "./bookIdReducer";



const rootReducer = combineReducers({
  userId: userIdReducer,
  bookId: bookIdReducer,
});

export default rootReducer;
