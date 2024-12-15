import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots, selectAllSpots } from "../../store/spots.js";
import SpotCard from "../SpotCard/SpotCard.jsx";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const spots = useSelector(selectAllSpots);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllSpots()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  if (!isLoaded) return null;

  return (
    <>
      {isLoaded && (
        <div className="home-container">
          <div className="spots-container">
            {spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
