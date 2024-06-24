const express = require("express");
const { Spot } = require("../../db/models");

const router = express.Router();

//get all spots
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();

  res.status(200).json({ Spots: allSpots });
});

module.exports = router;
