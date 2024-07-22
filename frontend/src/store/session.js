import { csrfFetch } from "./csrf";

// Action Types
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

// Initial State
const initialState = {
  user: null,
};

// Action Creators
export const setUser = (user) => ({
  type: SET_USER,
  user,
});

export const removeUser = () => ({
  type: REMOVE_USER,
});

// Thunk Action
export const login = (credential, password) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password,
      }),
    });

    const data = await res.json();

    dispatch(setUser(data.user));
  } catch (error) {
    console.error("Login failed:", error);
  }
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case REMOVE_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default sessionReducer;
