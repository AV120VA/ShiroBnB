const express = require("express");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Spot } = require("../../db/models");
const { Review } = require("../../db/models");
const { User } = require("../../db/models");
const { ReviewImage } = require("../../db/models");

const router = express.Router();

const validateReviewCreation = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty({ checkFalsy: true })
    .isLength({ min: 1, max: 250 })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .notEmpty({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
];

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
