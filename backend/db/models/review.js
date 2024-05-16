"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(ReviewImage, { foreignKey: "reviewId" });
      Review.belongsTo(models.User, { foreignKey: "userId" });
      Review.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  Review.init(
    {
      // spotId: DataTypes.INTEGER,
      // userId: DataTypes.INTEGER,
      // review: DataTypes.STRING,
      // stars: DataTypes.INTEGER
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Spot",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 250],
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
          isInt: {
            args: true,
            msg: "Must be a number",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
