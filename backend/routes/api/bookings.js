const express = require("express");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Booking } = require("../../db/models");
const { Spot } = require("../../db/models");
const { User } = require("../../db/models");

const router = express.Router();

//get all of the current users bookings
router.get("/current", requireAuth, async (req, res) => {
  let bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
  });

  if (bookings) {
    return res.status(200).json({ Bookings: bookings });
  }

  if (!bookings) {
    return res.status(404).json({
      message: "You have no bookings",
    });
  }
});

module.exports = router;
