// userIdReducer.js
const initialState = localStorage.getItem("userId") || null;

const userIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_ID":
      localStorage.setItem("userId", action.payload);
      return action.payload;
    default:
      return state;
  }
};

export default userIdReducer;
