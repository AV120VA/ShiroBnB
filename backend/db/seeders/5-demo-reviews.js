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
        review: "The place was very nice. The vibe was immaculate.",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 3,
        review: "The place was very alright, could have been better.",
        stars: 3,
      },
      {
        spotId: 2,
        userId: 3,
        review: "The place was mid, but the host was nice!",
        stars: 3,
      },
      {
        spotId: 2,
        userId: 1,
        review: "The place was decent at best, should have stayed home.",
        stars: 3,
      },
      {
        spotId: 3,
        userId: 1,
        review: "The place was horrible, but the coffee shop nearby was nice.",
        stars: 2,
      },
      {
        spotId: 3,
        userId: 2,
        review: "The place was a disaster. It didnt feel safe to sleep in.",
        stars: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Bookings", null, {});
  },
};
