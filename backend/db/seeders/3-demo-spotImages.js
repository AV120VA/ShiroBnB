"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "image.png",
        preview: "true",
      },
      {
        spotId: 1,
        url: "image.png",
        preview: "true",
      },
      {
        spotId: 2,
        url: "image.png",
        preview: "true",
      },
      {
        spotId: 2,
        url: "image.png",
        preview: "true",
      },
      {
        spotId: 3,
        url: "image.png",
        preview: "true",
      },
      {
        spotId: 3,
        url: "image.png",
        preview: "true",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("SpotImages", null, {});
  },
};
