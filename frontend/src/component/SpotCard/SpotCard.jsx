import { useNavigate } from "react-router-dom";
import "./SpotCard.css";

function SpotCard({ spot }) {
  const navigate = useNavigate();

  const onClick = (spotId) => {
    //add stuff for delete and update here with event later

    navigate(`/spots/${spotId}`);
  };

  let imageUrl;

  if (spot.previewImage) {
    imageUrl = spot.previewImage;
  } else if (spot.SpotImages.length > 0) {
    imageUrl = spot.SpotImages[0];
  }

  return (
    <div
      className="spot-card-container"
      title={`${spot.name}`}
      onClick={() => onClick(spot.id)}
    >
      <img className="spot-card-img" src={`${imageUrl}`} alt="preview" />
      <div className="detail-box">
        <p className="location">
          {spot.city}, {spot.state}
        </p>
        <div className="rating-box">
          <img className="star" src="star.png" alt="star" />
          <p className="rating">{spot.avgRating ? spot.avgRating : "New"}</p>
        </div>
      </div>
      <p className="price">${spot.price} per night</p>
    </div>
  );
}

export default SpotCard;
