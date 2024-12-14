import { useDispatch, useSelector } from "react-redux";
import { getReviewsById } from "../../store/reviews";
import { useEffect, useState } from "react";
import Review from "../Review/Review";

function ReviewCallout({ spotId }) {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const reviews = useSelector((state) => state.reviews.spotReviews);

  useEffect(() => {
    dispatch(getReviewsById(spotId)).then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  return <>{isLoaded && <Review reviews={reviews} />}</>;
}

export default ReviewCallout;
