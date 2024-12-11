const { Sequelize, Model, DataType } = require("sequelize");

class Notification extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        notiID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        notiGroupCd: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        userID: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        centerID: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        centerName: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        courseID: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        courseName: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        notiTitle: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        notiContents: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        postID: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        isRead: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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
        updatedAt: "updatedAt",
        modelName: "Notification",
        tableName: "notification",
      }
    );
  }
}

module.exports = Notification;
