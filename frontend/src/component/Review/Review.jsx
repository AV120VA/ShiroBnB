function Review({ reviews }) {
  return (
    <>
      {Object.values(reviews).map((review) => {
        let createdAt = new Date(review.createdAt);
        let formattedDate = createdAt.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        return (
          <div key={review.id} className="review-text">
            <p className="review-user-first-name">{review.User.firstName}</p>
            <p className="review-date">{formattedDate}</p>
            <p className="review-description-text">{review.review}</p>
          </div>
        );
      })}
    </>
  );
}

export default Review;
