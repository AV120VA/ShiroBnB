const express = require("express");
const { Op } = require("sequelize");

const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");

const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");

// const { handle } = require("express/lib/router"); idk where this came from, ignore unless theres an issue

const router = express.Router();

//might not use, keep here just in case
// const validateBookingCreation = [
//   check("startDate")
//     .isAfter(new Date())
//     .withMessage("startDate cannot be in the past"),
//   check("endDate")
//     .isAfter("startDate")
//     .withMessage("endDate cannot be on or before startDate"),
//   handleValidationErrors,
// ];

const formatDate = (date) => {
  const datePart = new Date(date)
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("-");
  const timePart = new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `${datePart} ${timePart}`;
};

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
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .optional()
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
  const {
    page = 1,
    size = 20,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
  } = req.query;

  const errors = {};

  if (page < 1 || page > 10)
    errors.page = "Page must be greater than or equal to 1";
  if (size < 1 || size > 20)
    errors.size = "Size must be greater than or equal to 1";
  if (maxLat && maxLat > 90) errors.maxLat = "Maximum latitude is invalid";
  if (minLat && minLat < -90) errors.minLat = "Minimum latitude is invalid";
  if (minLng && minLng < -180) errors.minLng = "Minimum longitude is invalid";
  if (maxLng && maxLng > 180) errors.maxLng = "Maximum longitude is invalid";
  if (minPrice && minPrice < 0)
    errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice && maxPrice < 0)
    errors.maxPrice = "Maximum price must be greater than or equal to 0";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  let where = {};

  if (minLat) where.lat = { ...where.lat, [Op.gte]: parseFloat(minLat) };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
  if (minLng) where.lng = { ...where.lng, [Op.gte]: parseFloat(minLng) };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
  if (minPrice)
    where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
  if (maxPrice)
    where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  try {
    const spots = await Spot.findAll({ where, limit, offset });

    const formattedSpots = await Promise.all(
      spots.map(async (spot) => {
        const avgRatingData = await Review.findOne({
          where: { spotId: spot.id },
          attributes: [
            [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"],
          ],
          raw: true,
        });

        const previewImage = await SpotImage.findOne({
          where: {
            spotId: spot.id,
            preview: true,
          },
          attributes: ["url"],
        });

        const avgRating =
          avgRatingData && avgRatingData.avgRating !== null
            ? parseFloat(avgRatingData.avgRating)
            : null;

        const formattedSpot = {
          ...spot.toJSON(),
          avgRating:
            avgRating !== null
              ? parseFloat(avgRating.toFixed(1))
              : "No reviews yet",
          previewImage: previewImage
            ? previewImage.url
            : "No preview image yet",
          createdAt: formatDate(spot.createdAt),
          updatedAt: formatDate(spot.updatedAt),
        };

        return formattedSpot;
      })
    );

    res
      .status(200)
      .json({ Spots: formattedSpots, page: parseInt(page), size: limit });
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get all spots of current user
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    let spots = await Spot.findAll({
      where: { ownerId: userId },
    });

    const formattedSpots = await Promise.all(
      spots.map(async (spot) => {
        const avgRatingData = await Review.findOne({
          where: { spotId: spot.id },
          attributes: [
            [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"],
          ],
          raw: true,
        });

        const previewImage = await SpotImage.findOne({
          where: {
            spotId: spot.id,
            preview: true,
          },
          attributes: ["url"],
        });

        const avgRating =
          avgRatingData && avgRatingData.avgRating !== null
            ? parseFloat(avgRatingData.avgRating)
            : null;

        const formattedSpot = {
          ...spot.toJSON(),
          avgRating:
            avgRating !== null
              ? parseFloat(avgRating.toFixed(1))
              : "No reviews yet",
          previewImage: previewImage
            ? previewImage.url
            : "No preview image yet",
          createdAt: formatDate(spot.createdAt),
          updatedAt: formatDate(spot.updatedAt),
        };

        return formattedSpot;
      })
    );

    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    console.error("Error fetching user's spots:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get details of a spot by id

router.get("/:spotId", async (req, res) => {
  const id = req.params.spotId;

  try {
    let spot = await Spot.findByPk(id);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    let spotImages = await SpotImage.findAll({
      where: {
        spotId: id,
      },
      attributes: ["id", "url", "preview"],
    });

    let owner = await User.findByPk(spot.ownerId, {
      attributes: ["id", "firstName", "lastName"],
    });

    const avgRatingData = await Review.findOne({
      where: { spotId: spot.id },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
      ],
      raw: true,
    });

    const numReviews = await Review.count({
      where: { spotId: spot.id },
    });

    const avgStarRating =
      avgRatingData && avgRatingData.avgStarRating !== null
        ? parseFloat(avgRatingData.avgStarRating)
        : null;

    const response = {
      ...spot.toJSON(),
      numReviews: numReviews,
      avgStarRating:
        avgStarRating !== null
          ? parseFloat(avgStarRating.toFixed(1))
          : "No reviews yet",
      SpotImages: spotImages,
      Owner: owner ? owner.toJSON() : null,
    };

    response.createdAt = formatDate(response.createdAt);
    response.updatedAt = formatDate(response.updatedAt);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching spot details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//create a spot
router.post("/", requireAuth, validateCreation, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const formattedLat = parseFloat(lat);
  const formattedLng = parseFloat(lng);
  const formattedPrice = parseFloat(price);

  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat: formattedLat ? formattedLat : 0.0,
    lng: formattedLng ? formattedLng : 0.0,
    name,
    description,
    price: formattedPrice,
  });

  const formattedSpot = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: formattedLat,
    lng: formattedLng,
    name: spot.name,
    description: spot.description,
    price: formattedPrice,
    createdAt: formatDate(spot.createdAt),
    updatedAt: formatDate(spot.updatedAt),
  };

  return res.status(201).json(formattedSpot);
});

//add an image to a spot based on the spot id

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const userId = req.user.id;

  if (spot.ownerId !== userId) {
    return res.status(403).json({
      message: "You are not authorized to perform this action",
    });
  }

  if (spot && spot.ownerId === userId) {
    const newSpotImage = await SpotImage.create({
      url,
      preview,
      spotId: spot.id,
    });

    return res.status(200).json({
      id: newSpotImage.id,
      url: newSpotImage.url,
      preview: newSpotImage.preview,
    });
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

  let errors = {};

  if (address.length < 1) errors.address = "Street address is required";
  if (city.length < 1) errors.city = "City is required";
  if (state.length < 1) errors.state = "State is required";
  if (country.length < 1) errors.country = "Country is required";
  if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
  if (lng < -180 || lat > 180)
    errors.lng = "Longitude must be within -180 and 180";
  if (name.length < 1) errors.name = "Name is required";
  if (name.length >= 50) errors.name = "Name must be less than 50 characters";
  if (description.length < 1) errors.description = "Description is required";
  if (price < 0) errors.price = "Price per day must be a positive number";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad request",
      errors,
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
    await spot.save();

    // Format dates
    const formattedSpot = {
      ...spot.toJSON(),
      createdAt: formatDate(spot.createdAt),
      updatedAt: formatDate(spot.updatedAt),
    };

    return res.status(200).json(formattedSpot);
  }
});

//delete a spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const userId = req.user.id;

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
  try {
    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    let reviews = await Review.findAll({
      where: {
        spotId: spot.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          as: "ReviewImages",
        },
      ],
    });

    // Format createdAt and updatedAt
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: formatDate(review.createdAt),
      updatedAt: formatDate(review.updatedAt),
      User: {
        id: review.User.id,
        firstName: review.User.firstName,
        lastName: review.User.lastName,
      },
      ReviewImages: review.ReviewImages.map((image) => ({
        id: image.id,
        url: image.url,
      })),
    }));

    return res.status(200).json({ Reviews: formattedReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
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

    let checkReviews = await Review.findAll({
      where: {
        userId: req.user.id,
        spotId: spot.id,
      },
    });

    if (checkReviews.length > 0) {
      return res.status(500).json({
        message: "You have already left a review on this spot",
      });
    }

    let newReview = await Review.create({
      userId: req.user.id,
      spotId: req.params.spotId,
      review: req.body.review,
      stars: req.body.stars,
    });

    // Format createdAt and updatedAt
    const formattedReview = {
      ...newReview.toJSON(),
      createdAt: formatDate(newReview.createdAt),
      updatedAt: formatDate(newReview.updatedAt),
    };

    return res.status(201).json(formattedReview);
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

  if (spot.id === req.user.id) {
    const formattedBookings = bookings.map((booking) => ({
      User: {
        id: booking.User.id,
        firstName: booking.User.firstName,
        lastName: booking.User.lastName,
      },
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: formatDate(booking.createdAt),
      updatedAt: formatDate(booking.updatedAt),
    }));

    return res.status(200).json({
      Bookings: formattedBookings,
    });
  }

  if (spot.id !== req.user.id) {
    const formattedBookings = bookings.map((booking) => ({
      spotId: booking.spotId,
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));

    return res.status(200).json({
      Bookings: formattedBookings,
    });
  }
});

//create a booking from a spot based on the spots id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId === req.user.id) {
    return res.status(403).json({
      message: "You cannot book your own spot",
    });
  }

  let currentDate = new Date();
  let formattedStartDate = new Date(req.body.startDate);
  let formattedEndDate = new Date(req.body.endDate);

  if (formattedStartDate < currentDate) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
      },
    });
  }

  if (formattedEndDate <= formattedStartDate) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }

  // check for booking conflicts
  let checkBooking = await Booking.findAll({
    where: {
      spotId: req.params.spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [
              formattedStartDate.toISOString(),
              formattedEndDate.toISOString(),
            ],
          },
        },
        {
          endDate: {
            [Op.between]: [
              formattedStartDate.toISOString(),
              formattedEndDate.toISOString(),
            ],
          },
        },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: formattedStartDate.toISOString() } },
            { endDate: { [Op.gte]: formattedEndDate.toISOString() } },
          ],
        },
      ],
    },
  });

  if (checkBooking.length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  let newBooking = await Booking.create({
    spotId: req.params.spotId,
    userId: req.user.id,
    startDate: formattedStartDate.toISOString(),
    endDate: formattedEndDate.toISOString(),
  });

  // Format createdAt and updatedAt to "YYYY-MM-DD HH:mm:ss"
  const formattedNewBooking = {
    ...newBooking.toJSON(),
    createdAt: newBooking.createdAt
      .toISOString()
      .replace("T", " ")
      .slice(0, 19),
    updatedAt: newBooking.updatedAt
      .toISOString()
      .replace("T", " ")
      .slice(0, 19),
    startDate: formattedStartDate.toISOString().split("T")[0],
    endDate: formattedEndDate.toISOString().split("T")[0],
  };

  return res.status(201).json(formattedNewBooking);
});

module.exports = router;
