import { useDispatch, useSelector } from "react-redux";
import { getReviewsById } from "../../store/reviews";
import { useEffect, useState, useMemo } from "react";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import Review from "../Review/Review";
import "./ReviewCallout.css";

function ReviewCallout({ spot }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false); // Add a state to trigger re-fetch

  // Memoize reviews initialization to avoid changing dependencies on every render
  const reviews = useSelector((state) => state.reviews.spotReviews);
  const reviewsArray = useMemo(() => {
    return reviews ? Object.values(reviews) : [];
  }, [reviews]);

  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Fetch reviews when component mounts or refreshToggle changes
  useEffect(() => {
    dispatch(getReviewsById(spot.id)).then(() => setIsLoaded(true));
  }, [dispatch, spot.id, refreshToggle]); // Refresh when refreshToggle changes

  useEffect(() => {
    if (isLoaded && sessionUser && reviewsArray.length > 0) {
      const reviewed = reviewsArray.some(
        (review) => review?.User?.id === sessionUser.id
      );
      setAlreadyReviewed(reviewed);
    } else {
      setAlreadyReviewed(false);
    }
  }, [isLoaded, reviewsArray, sessionUser]);

  // Trigger the refresh of reviews by changing the refreshToggle state
  const handleDelete = () => {
    setRefreshToggle((prev) => !prev); // Toggle to trigger re-fetch of reviews
  };

  return (
    <>
      {isLoaded && (
        <div className="review-section-box">
          <div className="review-info-box">
            <div className="star-and-rating">
              <img className="review-section-star" src="/star.png" alt="star" />
              {reviewsArray.length > 0 ? (
                <p className="review-callout-text">
                  {spot.avgStarRating?.toFixed(1) || "0.0"}
                </p>
              ) : (
                <p className="review-callout-text">0.0</p>
              )}
            </div>
            {reviewsArray.length > 0 && (
              <p className="review-callout-text">•</p>
            )}
            <div className="review-count">
              {reviewsArray.length > 0 ? (
                <>
                  <p className="review-callout-text"># {reviewsArray.length}</p>
                  {reviewsArray.length === 1 ? (
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
                <OpenModalButton
                  className="post-review-button"
                  buttonText="Post Your Review"
                  modalComponent={<CreateReviewModal spotId={spot.id} />}
                />
                {reviewsArray.length === 0 && (
                  <p className="first-to-post">
                    Be the first to post a review!
                  </p>
                )}
              </>
            )}
          <Review reviews={reviews} onDelete={handleDelete} />{" "}
          {/* Pass onDelete here */}
        </div>
      )}
    </>
  );
}

export default ReviewCallout;
