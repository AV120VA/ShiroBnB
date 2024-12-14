import { useSelector } from "react-redux";

function Review({ reviews }) {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <>
      {Object.values(reviews).length > 0
        ? Object.values(reviews).map((review) => {
            let createdAt = new Date(review.createdAt);
            let formattedDate = createdAt.toLocaleString("default", {
              month: "long",
              year: "numeric",
            });
            return (
              <div key={review.id} className="review-text">
                <p className="review-user-first-name">
                  {review.User.firstName}
                </p>
                <p className="review-date">{formattedDate}</p>
                <p className="review-description-text">{review.review}</p>
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
