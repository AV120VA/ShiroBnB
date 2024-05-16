"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: "userId" });
      Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
    }
  }
  Booking.init(
    {
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
      startDate: {
        type: DataTypes.DATE,
        allowNull: "false",
        validate: {
          isDate: {
            args: true,
            msg: "Please select a valid date.",
          },
          isAfter: {
            args: [new Date()],
            msg: "Please select a valid date.",
          },
          isBefore: {
            args: [
              new Date(
                new Date().getFullYear() + 2,
                new Date().getMonth(),
                new Date().getDate()
              ),
            ],
            msg: "Please select a valid date.",
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            args: true,
            msg: "Please select a valid date.",
          },
          isBefore: {
            args: [
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() - 91
              ),
            ],
            msg: "Please select a valid date.",
          },
          isAfter: {
            args: [new Date()],
            msg: "Please select a valid date.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
