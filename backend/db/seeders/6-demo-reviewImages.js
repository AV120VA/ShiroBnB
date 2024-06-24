"use strict";

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "image.png",
      },
      {
        reviewId: 1,
        url: "image.png",
      },
      {
        reviewId: 2,
        url: "image.png",
      },
      {
        reviewId: 2,
        url: "image.png",
      },
      {
        reviewId: 3,
        url: "image.png",
      },
      {
        reviewId: 3,
        url: "image.png",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ReviewImages", null, {});
  },
};
