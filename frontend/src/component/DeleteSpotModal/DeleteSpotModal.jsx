import { deleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteSpotModal.css";

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const dispatchDelete = async () => {
    await dispatch(deleteSpot(spotId)).then(setModalContent(null));
  };

  return (
    <div className="delete-modal-container">
      <div className="spot-delete-text">
        <h1>Confirm Delete</h1>{" "}
        <p>Are you sure you want to remove this spot?</p>
      </div>
      <div className="spot-delete-buttons">
        <button
          className="confirmation-button confirm-delete"
          onClick={dispatchDelete}
        >
          Yes (Delete Spot)
        </button>
        <button
          className="confirmation-button cancel-delete"
          onClick={() => setModalContent(null)}
        >
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
