// third-party
import { combineReducers } from "redux";

// project import
import setUserIdReducer from "./setUserId";
import setBookIdReducer from "./setBookId";
import userReducer from "./user";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  setUserId: setUserIdReducer,
  setBookId: setBookIdReducer,
  user: userReducer,
});

export default reducers;
