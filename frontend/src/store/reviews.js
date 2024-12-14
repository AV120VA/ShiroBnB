//import { csrfFetch } from "./csrf";

// Action Types
const LOAD_REVIEWS_BY_ID = "reviews/loadReviewsById";

// Action Creators
const loadReviewsById = (reviews) => {
  return {
    type: LOAD_REVIEWS_BY_ID,
    reviews,
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
    default:
      return state;
  }
}

export default reviewsReducer;
