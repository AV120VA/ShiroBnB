const express = require("express");
const { Spot } = require("../../db/models");

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
  //need to make seeder files for spotImages in order to be able to test for the response body they want
});

module.exports = router;
