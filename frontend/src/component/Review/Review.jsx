import { useSelector } from "react-redux";
import "./Review.css";

function Review({ reviews }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sortedReviews = Object.values(reviews).sort((a, b) => b.id - a.id);

  return (
    <>
      {sortedReviews.length > 0
        ? sortedReviews.map((review) => {
            let createdAt = new Date(review.createdAt);
            let formattedDate = createdAt.toLocaleString("default", {
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
                  <button
                    className="delete-review-button"
                    onClick={() => alert("add functionality")}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            );
          })
        : null}
    </>
  );
}

export default Review;
