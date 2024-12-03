// USE LATER
// import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

// headers shortcut

// const headers = {
//   "Content-type": "application/json",
// };

// Action Types

const LOAD_SPOTS = "spots/loadSpots";

// Action Creators

const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots,
  };
};

// Thunks

export const getAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");

  if (response.ok) {
    const data = await response.json();
    const spots = data.Spots;
    dispatch(loadSpots(spots));
  } else {
    return await response.json();
  }
};

// Reducers

const initialState = {};

function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newSpots = {};
      action.spots.forEach((spot) => {
        newSpots[spot.id] = spot;
      });
      return newSpots;
    }
    default:
      return state;
  }
}

// Selectors

export const selectSpots = (state) => state.spots;

export const selectAllSpots = createSelector([selectSpots], (spots) => {
  return spots ? Object.values(spots) : [];
});

export default spotsReducer;
