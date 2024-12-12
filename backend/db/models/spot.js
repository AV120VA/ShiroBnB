"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
        as: "SpotImages",
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100],
          notEmpty: true,
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
          notEmpty: true,
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
          notEmpty: true,
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
          notEmpty: true,
        },
      },
      lat: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
        validate: {
          min: -90,
          max: 90,
          isNumeric: {
            args: true,
            msg: "Latitude must be a number",
          },
        },
      },
      lng: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
        validate: {
          min: -180,
          max: 180,
          isNumeric: {
            args: true,
            msg: "Longitude must be a number",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 500],
          notEmpty: true,
        },
      },
      price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
          min: 0.01,
          max: 999999.99,
          isNumeric: {
            args: true,
            msg: "Price must be a number",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
