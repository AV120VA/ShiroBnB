const express = require("express");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Spot } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { User } = require("../../db/models");

const router = express.Router();

//delete a spot image
router.delete("/:imageId", requireAuth, async (req, res) => {
  let image = await SpotImage.findByPk(req.params.imageId);

  if (!image) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }

  let spot = await Spot.findByPk(image.spotId);
  let owner = await User.findByPk(spot.ownerId);

  if (owner.id !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to perform this action",
    });
  }

  await image.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
