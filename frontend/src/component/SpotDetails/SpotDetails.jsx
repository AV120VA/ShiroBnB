import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from "../../store/spots";
import ReviewCallout from "../ReviewCallout/ReviewCallout";
import "./SpotDetails.css";

function SpotDetail() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.spotById);
  const [isLoaded, setIsLoaded] = useState(false);
  let reviewLabel;

  if (isLoaded && spot) {
    if (spot.numReviews === 0) {
      reviewLabel = "New";
    } else if (spot.numReviews === 1) {
      reviewLabel = "Review";
    } else {
      reviewLabel = "Reviews";
    }
  }
  //const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getSpotById(spotId)).then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  return (
    <>
      {isLoaded && (
        <div className="spot-details-page">
          <div className="location-details">
            <h1 className="spot-details-header">{spot.name}</h1>
            <p className="description-text">
              {" "}
              {spot.city}, {spot.state}, {spot.country}{" "}
            </p>
          </div>
          <div className="picture-box">
            <img
              className="image-radius big-image"
              src={spot.SpotImages[0].url}
            />
            <div className="small-images">
              {spot.SpotImages.map((image) => {
                if (!image.preview) {
                  return (
                    <img
                      key={image.id}
                      className=" image-radius small-image"
                      src={image.url}
                      alt="spot image"
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="description-reserve">
            <div className="description">
              <h3 className="host">
                Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
              </h3>
              <p className="description-text"> {spot.description} </p>
            </div>
            <div className="reserve-card">
              <div className="reserve-text">
                <div className="price-box">
                  <p className="card-price white-text">${spot.price} night</p>
                </div>
                <div className="spot-reviews-box">
                  <div className="spacer-box">
                    <img src="/star.png" alt="star" className="details-star" />
                    <p className=" white-text review-count">
                      {spot.avgStarRating}
                    </p>
                  </div>
                  <p className="white-text"></p>
                  <p className="review-count white-text">
                    {spot.numReviews} {reviewLabel}
                  </p>
                </div>
              </div>
              <div className="reserve-button-box">
                <button
                  type="button"
                  className="reserve-button"
                  onClick={() => alert("Feature Coming Soon!")}
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
          <div className="reviews-containter"></div>
          <ReviewCallout spot={spot} />
        </div>
      )}
    </>
  );
}

export default SpotDetail;
