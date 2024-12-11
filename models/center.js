const { Sequelize, Model, DataType, NONE } = require("sequelize");

class Center extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        // centerID	centerName	postalCode	address	phone	createdAt	isDeleted
        centerID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        centerName: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        postalCode: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(11),
          allowNull: true,
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
        modelName: "Center",
        tableName: "center",
      }
    );
  }
}

module.exports = User;
