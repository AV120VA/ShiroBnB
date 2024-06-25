const express = require("express");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Review } = require("../../db/models");
const { ReviewImage } = require("../../db/models");
const { User } = require("../../db/models");

const router = express.Router();

//delete a review image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const image = await ReviewImage.findByPk(req.params.imageId);
  const review = await Review.findByPk(image.reviewId);
  const owner = await User.findByPk(review.userId);

  if (!image) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
    });
  }

  if (owner.id !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to perform that action",
    });
  }

  await image.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
