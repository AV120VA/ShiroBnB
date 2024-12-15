import { useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import { addReviewThunk } from "../../store/reviews";
import { getReviewsById } from "../../store/reviews";
import { getSpotById } from "../../store/spots";
import "./CreateReviewModal.css";

function CreateReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState("");
  const isDisabled = userRating <= 0 || review.trim().length < 10;

  const handleMouseEnter = (rating) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = (rating) => {
    setUserRating(rating);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(
        addReviewThunk(spotId, {
          review,
          stars: userRating,
        })
      );

      await dispatch(getSpotById(spotId));
      await dispatch(getReviewsById(spotId));
      setModalContent(null);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <form className="create-review-container" onSubmit={handleSubmit}>
      <h1 className="create-review-header">How was your stay?</h1>
      <textarea
        placeholder="Leave your review here..."
        className="create-review-text"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <div className="rate-by-stars">
        {[1, 2, 3, 4, 5].map((rating) => (
          <img
            key={rating}
            className="review-rating-star"
            src="/star.png"
            alt={`star-${rating}`}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(rating)}
            style={{
              filter:
                rating <= (hoveredRating || userRating)
                  ? "grayscale(0%)"
                  : "grayscale(100%)",
              cursor: "pointer",
            }}
          />
        ))}
        <p className="star-rating-text">Stars</p>
      </div>
      <button disabled={isDisabled} className="submit-review-button">
        Submit Your Review
      </button>
    </form>
  );
}

export default CreateReviewModal;
