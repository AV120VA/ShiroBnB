const express = require("express");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Spot } = require("../../db/models");
const { Review } = require("../../db/models");
const { User } = require("../../db/models");
const { ReviewImage } = require("../../db/models");
const router = express.Router();

//get all reviews of the current user
router.get("/current", requireAuth, async (req, res) => {
  try {
    let reviews = await Review.findAll({
      where: {
        userId: req.user.id,
      },
    });
    if (reviews) {
      return res.status(200).json({
        Reviews: reviews,
      });
    } else if (!reviews) {
      return res.json({
        message: "No reviews found for this user",
      });
    }
  } catch (error) {
    return res.json({
      message: error,
    });
  }
});

module.exports = router;
