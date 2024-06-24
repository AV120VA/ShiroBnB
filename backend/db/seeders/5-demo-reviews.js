"use strict";

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "The place was very nice",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 3,
        review: "The place was mid",
        stars: 3,
      },
      {
        spotId: 3,
        userId: 1,
        review: "The place was horrible",
        stars: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Bookings", null, {});
  },
};
