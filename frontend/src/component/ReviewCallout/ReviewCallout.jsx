import { useDispatch, useSelector } from "react-redux";
import { getReviewsById } from "../../store/reviews";
import { useEffect, useState } from "react";
import Review from "../Review/Review";
import "./ReviewCallout.css";

function ReviewCallout({ spot }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const reviews = useSelector((state) => state.reviews.spotReviews);

  useEffect(() => {
    dispatch(getReviewsById(spot.id)).then(() => setIsLoaded(true));
  }, [dispatch, spot.id]);

  return (
    <>
      {isLoaded && (
        <div className="review-section-box">
          <div className="review-info-box">
            <img className="review-section-star" src="/star.png" alt="star" />
            {Object.values(reviews).length > 0 ? (
              <>
                {" "}
                <p>{spot.avgStarRating}</p>
                <p># {spot.numReviews}</p>{" "}
              </>
            ) : (
              <p>New!</p>
            )}
          </div>
          {spot.ownerId !== sessionUser.id ? (
            <button className="post-review-button">Post Your Review</button>
          ) : null}
          <Review reviews={reviews} />
        </div>
      )}
    </>
  );
}

export default ReviewCallout;
