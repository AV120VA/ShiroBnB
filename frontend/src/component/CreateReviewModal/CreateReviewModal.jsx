import { useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import "./CreateReviewModal.css";

function CreateReviewModal() {
  const { setModalContent } = useModal();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const handleMouseEnter = (rating) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = (rating) => {
    setUserRating(rating);
  };

  return (
    <div className="create-review-container">
      <h1 className="create-review-header">How was your stay?</h1>
      <textarea
        placeholder="Leave your review here..."
        className="create-review-text"
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
      <button className="submit-review-button">Submit Your Review</button>
    </div>
  );
}

export default CreateReviewModal;
