import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

const headers = {
  "Content-Type": "application/json",
};

// Action Types

const LOAD_SPOTS = "spots/loadSpots";
const LOAD_SPOT_BY_ID = "spots/loadSpotById";
const UPDATE_SPOT = "spots/updateSpot";
const REMOVE_SPOT = "spots/deleteSpot";

// Action Creators

const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots,
  };
};

const loadSpotById = (spots) => {
  return {
    type: LOAD_SPOT_BY_ID,
    spots,
  };
};

const removeSpot = (spotId) => {
  return {
    type: REMOVE_SPOT,
    spotId,
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

export const getSpotById = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`);
  const spot = await response.json();
  dispatch(loadSpotById(spot));
  return spot;
};

export const updateSpot = (spotId, spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(spotData),
    });
    const updatedSpot = await response.json();
    dispatch({
      type: "UPDATE_SPOT",
      payload: updatedSpot,
    });
    return updatedSpot;
  } catch (e) {
    return e;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeSpot(spotId));
      return response;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (e) {
    console.log("Unable to delete spot:", e);
    return e;
  }
};

export const addSpot = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      headers,
      body: JSON.stringify(spotData),
    });

    if (response.ok) {
      const newSpot = await response.json();
      dispatch({ type: "ADD_SPOT", payload: newSpot });
      return newSpot;
    }
  } catch (e) {
    return e;
  }
};

export const addSpotImage = (spotId, image) => async () => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers,
      body: JSON.stringify(image),
    });
    const newImage = await response.json();
    return newImage;
  } catch (e) {
    return e;
  }
};

// Reducer

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
    case LOAD_SPOT_BY_ID: {
      return { ...state, spotById: action.spots };
    }
    case UPDATE_SPOT: {
      const updatedSpot = action.payload;
      const currentSpot = state[updatedSpot.id] || {};
      updatedSpot.numReviews = updatedSpot.reviews.length;
      updatedSpot.avgStarRating =
        updatedSpot.reviews.reduce((acc, review) => acc + review.stars, 0) /
        updatedSpot.reviews.length;
      return {
        ...state,
        [updatedSpot.id]: {
          ...currentSpot,
          ...updatedSpot,
        },
      };
    }
    case REMOVE_SPOT: {
      const updatedState = { ...state };
      delete updatedState[action.spotId];
      return updatedState;
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

export const selectUserSpots = createSelector([selectSpots], (spots) => {
  return spots && spots.userSpots ? Object.values(spots.userSpots) : [];
});

export default spotsReducer;
