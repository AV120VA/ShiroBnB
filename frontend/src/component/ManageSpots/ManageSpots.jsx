import "./ManageSpots.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots, selectAllSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import ManageCard from "../ManageCard/ManageCard";

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector(selectAllSpots);
  const userSpots = spots.filter((spot) => spot.ownerId === sessionUser.id);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllSpots()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  if (!isLoaded) return null;

  return (
    <>
      {isLoaded && userSpots.length > 0 ? (
        <div className="manage-spots-container">
          <h1>Manage Your Spots</h1>
          <div className="manage-card-box">
            {userSpots.map((spot) => (
              <ManageCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      ) : (
        <div className="manage-not-logged-in">
          <h1>Manage Your Spots</h1>
          <button
            className="manage-create-button"
            onClick={() => navigate("/create-spot")}
          >
            Create a Spot
          </button>
        </div>
      )}
    </>
  );
}

export default ManageSpots;
