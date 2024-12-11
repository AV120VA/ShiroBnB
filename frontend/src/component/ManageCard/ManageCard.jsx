import "./ManageCard.css";
import { useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";

function ManageCard({ spot }) {
  const navigate = useNavigate();
  let imageUrl = spot.previewImage;
  return (
    <div className="manage-card-container" title={`${spot.name}`}>
      <img
        className="manage-card-img"
        src={`${imageUrl}`}
        onClick={() => navigate(`/spots/${spot.id}`)}
        alt="preview"
      />
      <div
        className="manage-detail-box"
        onClick={() => navigate(`/spots/${spot.id}`)}
      >
        <p className="location">
          {spot.city}, {spot.state}
        </p>
        <div className="manage-rating-box">
          <img className="star" src="/star.png" alt="star" />
          <p className="rating">{spot.avgRating ? spot.avgRating : "New"}</p>
        </div>
      </div>
      <p className="price">${spot.price} per night</p>
      <div className="manage-buttons-container">
        <button
          onClick={() => navigate(`/update-spot/${spot.id}`)}
          className="manage-button"
        >
          Update
        </button>
        <OpenModalButton
          buttonText="Delete"
          modalComponent={<DeleteSpotModal spotId={spot.id} />}
          className="manage-button"
        />
      </div>
    </div>
  );
}

export default ManageCard;
