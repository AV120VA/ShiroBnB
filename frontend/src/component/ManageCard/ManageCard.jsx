import "./ManageCard.css";
import { useNavigate } from "react-router-dom";

function ManageCard({ spot }) {
  const navigate = useNavigate();
  let imageUrl = spot.previewImage;
  return (
    <div className="manage-card-container" title={`${spot.name}`}>
      <img className="manage-card-img" src={`/${imageUrl}`} alt="preview" />
      <div className="manage-detail-box">
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
        <button className="manage-button">Delete</button>
      </div>
    </div>
  );
}

export default ManageCard;
