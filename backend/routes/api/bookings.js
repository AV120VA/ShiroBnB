const express = require("express");

const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op } = require("sequelize");

const { Booking } = require("../../db/models");
const { Spot } = require("../../db/models");
const { User } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { format } = require("morgan");

const router = express.Router();

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

const formatDate2 = (date) => {
  return new Date(date)
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("-");
};

//get all of the current users bookings

router.get("/current", requireAuth, async (req, res) => {
  try {
    let bookings = await Booking.findAll({
      where: {
        userId: req.user.id,
      },
      include: {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
      },
    });

    if (bookings.length > 0) {
      const formattedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const spot = booking.Spot.toJSON();

          const previewImage = await SpotImage.findOne({
            where: {
              spotId: spot.id,
              preview: true,
            },
            attributes: ["url"],
          });

          spot.previewImage = previewImage
            ? previewImage.url
            : "No preview image yet";

          return {
            id: booking.id,
            spotId: booking.spotId,
            Spot: {
              id: spot.id,
              ownerId: spot.ownerId,
              address: spot.address,
              city: spot.city,
              state: spot.state,
              country: spot.country,
              lat: spot.lat,
              lng: spot.lng,
              name: spot.name,
              price: spot.price,
              previewImage: spot.previewImage,
            },
            userId: booking.userId,
            startDate: formatDate2(booking.startDate), // Format startDate without time
            endDate: formatDate2(booking.endDate), // Format endDate without time
            createdAt: formatDate(booking.createdAt), // Keep createdAt with time
            updatedAt: formatDate(booking.updatedAt), // Keep updatedAt with time
          };
        })
      );

      return res.status(200).json({ Bookings: formattedBookings });
    }

    return res.status(404).json({
      message: "You have no bookings",
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//
//
//edit a booking
router.put("/:bookingId", requireAuth, async (req, res) => {
  let booking = await Booking.findByPk(req.params.bookingId);

  // Checking for existence of booking
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  // Checking booking belongs to user
  if (booking.userId !== req.user.id) {
    return res.status(403).json({
      message: "You can only edit your own bookings",
    });
  }

  // Body validation
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

  // Check for booking conflicts
  let checkBooking = await Booking.findAll({
    where: {
      spotId: booking.spotId,
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
      id: {
        [Op.ne]: booking.id, // Exclude current booking
      },
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

  // Update the booking
  booking.startDate = formattedStartDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  booking.endDate = formattedEndDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  await booking.save();

  // Format createdAt and updatedAt
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return res.status(200).json({
    id: booking.id,
    spotId: booking.spotId,
    userId: booking.userId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    createdAt: formatDate(booking.createdAt),
    updatedAt: formatDate(booking.updatedAt),
  });
});

//delete a booking //delete a booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  let booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  let spot = await Spot.findByPk(booking.spotId);
  let status = 0;
  let currentDate = new Date();
  let formattedStartDate = new Date(booking.startDate);

  if (currentDate >= formattedStartDate) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }
  if (booking.userId === req.user.id) {
    status = 1;
  }

  if (spot.ownerId === req.user.id) {
    status = 1;
  }

  if (status === 1) {
    await booking.destroy();
    return res.status(200).json({
      message: "Successfully deleted",
    });
  }

  if (status === 0) {
    return res.status(403).json({
      message: "You don't have the authorization for this action",
    });
  }
});

module.exports = router;
