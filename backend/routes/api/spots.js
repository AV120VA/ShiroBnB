const express = require("express");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const { Spot } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { User } = require("../../db/models");
const { Review } = require("../../db/models");
const { ReviewImage } = require("../../db/models");
const { Booking } = require("../../db/models");
// const { handle } = require("express/lib/router");

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
  handleValidationErrors,
];

const validateCreation = [
  check("address")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 100 })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 50 })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 50 })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 50 })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 500 })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0.01 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

//get all spots
router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();

  res.status(200).json({ Spots: allSpots });
});

//get all spots owned by current user
router.get("/current", requireAuth, async (req, res) => {
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

//create a spot
router.post("/", requireAuth, validateCreation, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const currentUserId = req.user.id;

  const newSpot = await Spot.create({
    ownerId: currentUserId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  if (newSpot) {
    return res.status(201).json({ newSpot });
  } else if (!newSpot) {
    return res.status(400).json({
      error: "error",
    });
  }
});

//add an image to a spot based on the spot id

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);

  const userId = req.user.id;

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== userId) {
    return res.status(403).json({
      message: "Targeted spot must belong to current user",
    });
  }

  if (spot && spot.ownerId === userId) {
    const newSpotImage = await SpotImage.create({
      url,
      preview,
      spotId: spot.id,
    });
    const formatSpotImage = {
      id: newSpotImage.id,
      url: newSpotImage.url,
      preview: newSpotImage.preview,
    };
    return res.status(200).json({ formatSpotImage });
  }
});

//edit a spot
router.put("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const userId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  if (spot.ownerId !== userId) {
    return res.status(403).json({
      message: "Targeted spot must belong to user",
    });
  }

  if (spot.ownerId === userId) {
    if (address) spot.address = address;
    if (city) spot.city = city;
    if (state) spot.state = state;
    if (country) spot.country = country;
    if (lat) spot.lat = lat;
    if (lng) spot.lng = lng;
    if (name) spot.name = name;
    if (description) spot.description = description;
    if (price) spot.price = price;

    await spot.validate();

    return res.status(200).json(spot);
  }
});

//delete a spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  console.log("is this endpoint even being hit ??????????");
  let spot = await Spot.findByPk(req.params.spotId);
  const userId = req.user.id;

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== userId) {
    return res.status(403).json({
      message: "You are not authorized to perform this action",
    });
  }
  await spot.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

//get all reviews by a spot's id
router.get("/:spotId/reviews", async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot) {
    let reviews = await Review.findAll({
      where: {
        spotId: spot.id,
      },
      include: [
        {
          model: ReviewImage,
          as: "ReviewImages",
        },
      ],
    });

    return res.status(200).json({ Reviews: reviews });
  }
});

//create a review for a spot based on the spots id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReviewCreation,
  async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }
    let newReview = await Review.create({
      userId: req.user.id,
      spotId: req.params.spotId,
      review: req.body.review,
      stars: req.body.stars,
    });

    return res.status(201).json({ ...newReview.toJSON() });
  }
);

//get all bookings for a spot based on the spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  let user = await User.findByPk(req.user.id);
  
  let bookings = await Booking.findAll({
    where: {
      spotId: spot.id,
    },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (spot.ownerId !== user.id) {
    return res.status(200).json({
      Bookings: bookings,
    });
  }

  if (spot.ownerId === user.id) {
    const formattedBookings = bookings.map((booking) => {
      const { User, ...bookingData } = booking.toJSON();
      return { User, ...bookingData };
    });

    return res.status(200).json({
      Bookings: formattedBookings,
    });
  }
});

module.exports = router;
