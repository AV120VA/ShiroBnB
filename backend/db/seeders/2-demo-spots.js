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
          "Himeji Castle, a UNESCO World Heritage Site, is Japans most beautiful and well-preserved castle. Known for its white facade and stunning architecture, it offers a glimpse into samurai history. Visitors can explore the castles grounds, gardens, and enjoy panoramic views, making it a perfect cultural experience.",
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
          "Okayama Castle, known as Crow Castle for its dark exterior, offers stunning views and a deep dive into Japans samurai history. Located near Korakuen Garden, it blends cultural exploration with nature. Explore the castles exhibits and relax in the peaceful garden for a unique, enriching experience.",
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
          "Located in the heart of Osaka, Osaka Castle is a symbol of Japans history and architecture. Surrounded by a landscaped park, it offers a peaceful escape with panoramic city views. Explore the castle, its museum, and nearby cherry blossoms. Enjoy the perfect blend of history and modern amenities.",
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
