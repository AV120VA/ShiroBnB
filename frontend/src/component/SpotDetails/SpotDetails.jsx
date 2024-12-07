import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from "../../store/spots";
import "./SpotDetails.css";

function SpotDetail() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.spotById);
  //const sessionUser = useSelector((state) => state.session.user);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getSpotById(spotId)).then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  return (
    <>
      {isLoaded && (
        <div className="spot-details-container">
          <h2>{spot.name}</h2>
          <div className="location-details">
            {spot.city}, {spot.state}, {spot.country}
          </div>
          <div className="picture-box"></div>
          <div className="description-reserve">
            <div className="description">
              <h2 className="host"> ASK ABOUT MODIFYING BACKEND</h2>
              <p className="description"> {spot.description} </p>
            </div>
            <div className="reserve-card">
              <div className="review-text">
                <p className="card-price">${spot.price} night</p>
                <img src="/star.png" alt="star" className="details-star" />
                <p className="review-count">{spot.numReviews}</p>
              </div>
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
      )}
    </>
  );
}

export default SpotDetail;
