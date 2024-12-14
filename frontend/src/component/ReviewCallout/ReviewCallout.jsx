import { useDispatch, useSelector } from "react-redux";
import { getReviewsById } from "../../store/reviews";
import { useEffect, useState } from "react";
import Review from "../Review/Review";
import "./ReviewCallout.css";

function ReviewCallout({ spot }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const reviews = useSelector((state) => state.reviews.spotReviews) || {};
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    dispatch(getReviewsById(spot.id)).then(() => setIsLoaded(true));
  }, [dispatch, spot.id, refreshToggle]);

  useEffect(() => {
    if (isLoaded && sessionUser && Object.values(reviews).length > 0) {
      const reviewed = Object.values(reviews).some(
        (review) => review?.User?.id === sessionUser.id
      );
      setAlreadyReviewed(reviewed);
    } else {
      setAlreadyReviewed(false);
    }
  }, [isLoaded, reviews, sessionUser]);

  const triggerRefresh = () => {
    setRefreshToggle((prev) => !prev);
  };

  return (
    <>
      {isLoaded && (
        <div className="review-section-box">
          <div className="review-info-box">
            <div className="star-and-rating">
              <img className="review-section-star" src="/star.png" alt="star" />
              {Object.values(reviews).length > 0 ? (
                <p className="review-callout-text">
                  {spot.avgStarRating?.toFixed(1) || "0.0"}
                </p>
              ) : (
                <p className="review-callout-text">0.0</p>
              )}
            </div>
            {Object.values(reviews).length > 0 && (
              <p className="review-callout-text">•</p>
            )}
            <div className="review-count">
              {Object.values(reviews).length > 0 ? (
                <>
                  <p className="review-callout-text"># {spot.numReviews}</p>
                  {Object.values(reviews).length === 1 ? (
                    <p className="review-callout-text">Review</p>
                  ) : (
                    <p className="review-callout-text">Reviews</p>
                  )}
                </>
              ) : (
                <p className="review-callout-text">New!</p>
              )}
            </div>
          </div>
          {spot.ownerId !== sessionUser?.id &&
            sessionUser &&
            !alreadyReviewed && (
              <>
                <button className="post-review-button">Post Your Review</button>
                {Object.values(reviews).length === 0 && (
                  <p className="first-to-post">
                    Be the first to post a review!
                  </p>
                )}
              </>
            )}
          <Review reviews={reviews} onDelete={triggerRefresh} />
        </div>
      )}
    </>
  );
}

export default ReviewCallout;
