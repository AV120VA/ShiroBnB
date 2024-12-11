"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Himeji St",
        city: "Himeji",
        state: "Hyogo",
        country: "Japan",
        lat: 80.98,
        lng: 179.99,
        name: "Himeji Castle",
        description: "Visit this lovely home in the mountains of Denver",
        price: 120,
        previewImage: "https://i.imgur.com/7jSRUAV.jpeg",
      },
      {
        ownerId: 2,
        address: "321 Kita Ward",
        city: "Marunouchi",
        state: "Okayama",
        country: "United States",
        lat: 81.98,
        lng: 159.99,
        name: "Okayama Castle",
        description: "Visit this lovely home in LA",
        price: 150,
        previewImage: "https://i.imgur.com/y18GfHI.jpeg",
      },
      {
        ownerId: 3,
        address: "456 Osaka St",
        city: "Chuo Ward",
        state: "Osaka",
        country: "United States",
        lat: 100.98,
        lng: 149.99,
        name: "Osaka Castle",
        description: "Visit this lovely penthouse in New York City",
        price: 120,
        previewImage: "https://i.imgur.com/h2kzWf4.jpeg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: {
          [Op.in]: ["123 Bogus Ave", "321 Bogus Ave", "456 Bogus Ave"],
        },
      },
      {}
    );
  },
};
