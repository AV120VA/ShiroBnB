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
          "Himeji Castle, known for its striking white facade and pristine condition, is often regarded as Japan’s most beautiful and well-preserved castle. As a UNESCO World Heritage Site, this castle offers a deep dive into Japan’s samurai history, with sprawling grounds that invite exploration. The interior of the castle showcases detailed craftsmanship and period artifacts, making it a great spot for history buffs. The castle's surrounding gardens are just as impressive, offering a serene atmosphere where you can take a peaceful stroll while enjoying seasonal blooms. Whether you're admiring the panoramic views of the city or soaking in the castle's history, Himeji Castle provides a one-of-a-kind cultural experience. Its close proximity to Himeji’s city center means guests can easily enjoy a mix of historical exploration and local cuisine, making it a perfect base for your trip.",
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
          "Okayama Castle, also known as Crow Castle for its dark exterior, is a stunning example of Japanese feudal architecture and a key landmark in the city. The castle is situated just a short walk from the famous Korakuen Garden, one of Japan’s top three landscape gardens, providing guests with an exceptional experience of natural beauty and historical significance. With its towering stone walls and intricate details, Okayama Castle offers breathtaking views of the surrounding area, including the adjacent garden and the Asahi River. The castle’s interior houses exhibits that delve into its history and the samurai culture, making it an educational and enriching destination. For nature lovers, the nearby Korakuen Garden is a peaceful retreat where you can relax and enjoy the picturesque surroundings. With its mix of cultural exploration and tranquil scenery, Okayama Castle is the perfect place to discover rich heritage of Japan while enjoying a serene atmosphere.",
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
          "Located in the heart of Osaka, Osaka Castle stands as a symbol of Japan’s rich history and impressive architectural feats. The castle is surrounded by a beautifully landscaped park, offering visitors a peaceful escape from the hustle and bustle of the city. With panoramic views of Osaka’s urban landscape, this castle provides a stunning backdrop for any stay. Whether you're walking through the scenic park, learning about the castle’s history at the museum, or enjoying the seasonal cherry blossoms, there’s always something to explore nearby. The castle’s iconic structure is a must-see for any history lover or architecture enthusiast, making it an unforgettable destination. Conveniently located near shopping, dining, and entertainment areas, this location provides the perfect balance of history and modern amenities, making it an ideal place to stay while exploring Osaka.",
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
