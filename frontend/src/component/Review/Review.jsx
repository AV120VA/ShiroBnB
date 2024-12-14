import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./Review.css";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

function Review({ reviews, onDelete }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sortedReviews = Object.values(reviews).sort((a, b) => b.id - a.id);

  const fixDateString = (dateString) => {
    if (dateString.includes(" 24:")) {
      const [datePart, timePart] = dateString.split(" ");
      const newDate = new Date(datePart);
      newDate.setDate(newDate.getDate() + 1);
      return `${newDate.toISOString().split("T")[0]}T00:${
        timePart.split(":")[1]
      }:${timePart.split(":")[2]}`;
    }
    return dateString.replace(" ", "T");
  };

  return (
    <>
      {sortedReviews.length > 0
        ? sortedReviews.map((review) => {
            console.log("REVIEW: ", review.createdAt);

            const fixedDateString = fixDateString(review.createdAt);
            const createdAt = new Date(fixedDateString);

            console.log("CREATED AT: ", createdAt);

            const formattedDate = createdAt.toLocaleString("default", {
              month: "long",
              year: "numeric",
            });

            return (
              <div key={review.id} className="review-text">
                <h3 className="review-user-first-name">
                  {review.User.firstName}
                </h3>
                <p className="review-text bold review-date">{formattedDate}</p>
                <p className="review-text review-description-text">
                  {review.review}
                </p>
                {review.User.id === sessionUser.id ? (
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={
                      <DeleteReviewModal reviewId={review.id} onDelete={onDelete} />
                    }
                    className="manage-button"
                  />
                ) : null}
              </div>
            );
          })
        : null}
    </>
  );
}

export default Review;
