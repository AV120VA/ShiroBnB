import { deleteReview } from "../../store/reviews";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";

function DeleteReviewModal({ reviewId, onDelete }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const dispatchDelete = async () => {
    console.log("Attempting to delete review with ID:", reviewId);
    try {
      await dispatch(deleteReview(reviewId));
      console.log("Review deleted successfully");
      setModalContent(null);

      if (onDelete) {
        console.log("Calling onDelete to refresh reviews");
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="delete-modal-container">
      <div className="review-delete-text">
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this review?</p>
      </div>
      <div className="review-delete-buttons">
        <button
          className="confirmation-button confirm-delete"
          onClick={dispatchDelete}
        >
          Yes (Delete review)
        </button>
        <button
          className="confirmation-button cancel-delete"
          onClick={() => setModalContent(null)}
        >
          No (Keep review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
