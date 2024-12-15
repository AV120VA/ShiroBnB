import { csrfFetch } from "./csrf";

const headers = {
  "Content-Type": "application/json",
};

// Action Types
const LOAD_REVIEWS_BY_ID = "reviews/loadReviewsById";
const REMOVE_REVIEW = "reviews/deleteReview";
const ADD_REVIEW = "reviews/addReview";

// Action Creators
const loadReviewsById = (reviews) => {
  return {
    type: LOAD_REVIEWS_BY_ID,
    reviews,
  };
};

const removeReview = (reviewId) => {
  return {
    type: REMOVE_REVIEW,
    reviewId,
  };
};

const addReview = (review) => {
  return {
    type: ADD_REVIEW,
    review,
  };
};

// Thunks
export const getReviewsById = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadReviewsById(reviews));
  } else {
    const error = await response.json();
    console.error("Failed to fetch reviews: ", error);
    throw error;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers,
    });
    if (response.ok) {
      dispatch(removeReview(reviewId));
      return response;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (e) {
    console.log("Unable to delete review:", e);
    return e;
  }
};

export const addReviewThunk = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const newReview = await response.json();
      dispatch(addReview(newReview));
      return newReview;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (e) {
    console.log("Error adding review:", e);
    return e;
  }
};

// Reducer
const initialState = {};

function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_REVIEWS_BY_ID: {
      const newReviews = {};
      action.reviews.Reviews.forEach((review) => {
        newReviews[review.id] = review;
      });
      return {
        ...state,
        spotReviews: newReviews,
      };
    }
    case REMOVE_REVIEW: {
      const newState = { ...state };
      delete newState.spotReviews[action.reviewId];
      return newState;
    }
    case ADD_REVIEW: {
      const newState = { ...state };
      newState.spotReviews[action.review.id] = action.review;
      return newState;
    }
    default:
      return state;
  }
}

export default reviewsReducer;
