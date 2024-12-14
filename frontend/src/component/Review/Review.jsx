function Review({ reviews }) {
  console.log("HERE", reviews);
  return (
    <>
      {Object.values(reviews).map((review) => {
        return <p>hi</p>;
      })}
    </>
  );
}

export default Review;
