import { useNavigate } from "react-router-dom";
import "./SpotCard.css";

function SpotCard({ spot }) {
  const navigate = useNavigate();

  const onClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  let imageUrl;

  if (spot.previewImage) {
    imageUrl = spot.previewImage;
  } else if (spot.SpotImages.length > 0) {
    imageUrl = spot.SpotImages[0].url;
  }

  return (
    <div
      className="spot-card-container"
      title={`${spot.name}`}
      onClick={() => onClick(spot.id)}
    >
      <img className="spot-card-img" src={`${imageUrl}`} alt="preview" />
      <div className="detail-box">
        <p className="location spot-card-text">
          {spot.city}, {spot.state}
        </p>
        <div className="rating-box">
          <img className="star" src="/star.png" alt="star" />
          <p className="rating spot-card-text">
            {spot.avgRating > 0 ? spot.avgRating : "New"}
          </p>
        </div>
      </div>
      <div className="price-box">
        <p className="price spot-card-text">${spot.price} night</p>
      </div>
    </div>
  );
}

export default SpotCard;
