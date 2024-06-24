"use strict";

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: "2024-08-12",
        endDate: "2024-08-22",
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2024-09-12",
        endDate: "2024-09-22",
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2024-10-12",
        endDate: "2024-10-22",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Bookings", null, {});
  },
};
