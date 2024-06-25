const express = require("express");
const { Spot } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { User } = require("../../db/models");

const router = express.Router();

//get all spots
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();

  res.status(200).json({ Spots: allSpots });
});

//get all spots owned by current user
router.get("/current", async (req, res) => {
  const userId = req.user.id;

  let userSpots = await Spot.findAll({
    where: { ownerId: userId },
  });

  res.status(200).json({ userSpots });
});

//get details of a spot by id
router.get("/:spotId", async (req, res) => {
  const id = req.params.spotId;

  let spot = await Spot.findByPk(id);
  let spotImages;
  let owner;

  if (spot) {
    spotImages = await SpotImage.findAll({
      where: {
        spotId: id,
      },
    });

    owner = await User.findByPk(spot.ownerId);

    const safeOwner = {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
    };

    return res
      .status(200)
      .json({ ...spot.toJSON(), SpotImages: spotImages, Owner: safeOwner });
  } else if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

module.exports = router;
