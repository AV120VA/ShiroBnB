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
        address: "123 Bogus Ave",
        city: "Denver",
        state: "CO",
        country: "United States",
        lat: 80.98,
        lng: 179.99,
        name: "Mountain Home",
        description: "Visit this lovely home in the mountains of Denver",
        price: 120,
      },
      {
        ownerId: 2,
        address: "321 Bogus Ave",
        city: "Los Angeles",
        state: "CA",
        country: "United States",
        lat: 81.98,
        lng: 159.99,
        name: "City Home",
        description: "Visit this lovely home in LA",
        price: 150,
      },
      {
        ownerId: 3,
        address: "456 Bogus Ave",
        city: "New York City",
        state: "NY",
        country: "United States",
        lat: 100.98,
        lng: 149.99,
        name: "Penthouse",
        description: "Visit this lovely penthouse in New York City",
        price: 120,
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
