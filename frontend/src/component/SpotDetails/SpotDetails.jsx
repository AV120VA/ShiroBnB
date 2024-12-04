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
          <h1>{spot.name}</h1>
          <div className="location-details">
            {spot.city}, {spot.state}, {spot.country}
          </div>
        </div>
      )}
    </>
  );
}

export default SpotDetail;
