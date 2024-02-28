// types
export const SET_USER_ID = "@user/SET_USER_ID";

// action creator
export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: { userId },
});

// reducer
const initialState = {
  userId: null,
};

const setUserIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload.userId,
      };
    default:
      return state;
  }
};

export default setUserIdReducer;
