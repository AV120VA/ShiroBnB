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
        url: "himeji-castle.png",
        preview: "true",
      },
      {
        spotId: 1,
        url: "image.png",
        preview: "false",
      },
      {
        spotId: 2,
        url: "okayama-castle.png",
        preview: "true",
      },
      {
        spotId: 2,
        url: "image.png",
        preview: "false",
      },
      {
        spotId: 3,
        url: "osaka-castle.png",
        preview: "true",
      },
      {
        spotId: 3,
        url: "image.png",
        preview: "false",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SpotImages", null, {});
  },
};
