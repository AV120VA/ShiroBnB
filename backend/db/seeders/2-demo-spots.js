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
        description:
          "A UNESCO World Heritage Site, Himeji Castle is known for its stunning white facade and rich samurai history. Explore the grounds, gardens, and enjoy panoramic views, a perfect cultural experience.",
        price: 120,
        previewImage: "https://i.imgur.com/7jSRUAV.jpeg",
      },
      {
        ownerId: 2,
        address: "321 Kita Ward",
        city: "Marunouchi",
        state: "Okayama",
        country: "Japan",
        lat: 81.98,
        lng: 159.99,
        name: "Okayama Castle",
        description:
          "Known as Crow Castle for its dark exterior, Okayama Castle offers rich samurai history and breathtaking views. Located near Korakuen Garden, enjoy a peaceful mix of culture and nature.",
        price: 150,
        previewImage: "https://i.imgur.com/y18GfHI.jpeg",
      },
      {
        ownerId: 3,
        address: "456 Osaka St",
        city: "Chuo Ward",
        state: "Osaka",
        country: "Japan",
        lat: 100.98,
        lng: 149.99,
        name: "Osaka Castle",
        description:
          "Osaka Castle, located in the heart of the city, is a symbol of Japans history and architecture. Surrounded by a park, explore the castle, museum, and enjoy panoramic city views.",
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
