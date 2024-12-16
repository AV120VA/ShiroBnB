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
      {
        ownerId: 1,
        address: "123 Nijo St",
        city: "Nakagyo",
        state: "Kyoto",
        country: "Japan",
        lat: 80.98,
        lng: 179.99,
        name: "Nijo Castle",
        description:
          "Discover Nijo Castle, a charming and historic retreat offering a unique blend of medieval architecture and modern amenities. Enjoy breathtaking views, spacious rooms, and a serene atmosphere perfect for relaxation.",
        price: 180,
        previewImage: "https://i.imgur.com/Y6NIvDQ.jpeg",
      },
      {
        ownerId: 2,
        address: "453 Marunouchi St",
        city: "Marunouchi",
        state: "Nagano",
        country: "Japan",
        lat: 81.98,
        lng: 159.99,
        name: "Matsumoto Castle",
        description:
          "Stay at Matsumoto Castle, a stunning piece of Japanese history. Experience traditional elegance with modern comfort, surrounded by picturesque views, lush gardens, and a peaceful, cultural atmosphere.",
        price: 250,
        previewImage: "https://i.imgur.com/y18GfHI.jpeg",
      },
      {
        ownerId: 3,
        address: "917 MadeUp St",
        city: "Maranouchi",
        state: "Kanazawa",
        country: "Japan",
        lat: 100.98,
        lng: 149.99,
        name: "Kanazawa Castle",
        description:
          "Discover Kanazawa Castle, a historic gem offering a blend of ancient beauty and serene surroundings. Enjoy panoramic views, peaceful gardens, and a rich cultural experience in the heart of Japan.",
        price: 220,
        previewImage: "https://i.imgur.com/keUXyUX.jpeg",
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
