const Sequelize = require("sequelize");

class Course extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        cmDtCd: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        courseName: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        courseDesc: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        userID: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: "Course",
        tableName: "course",
      }
    );
  }

  static associate(db) {
    db.Course.belongsTo(db.CommonDetailCode, { foreignKey: "cmDtCd", targetKey: "cmDtCd" });
    db.Course.belongsTo(db.User,             { foreignKey: "userID", targetKey: "userID" });
//                                                   Course.userID는         User.userID를 참조한다.

    db.Course.hasMany(db.Student,            { foreignKey: "courseID", sourceKey: "id" });
    db.Course.hasMany(db.AttendanceLog,      { foreignKey: "courseID", sourceKey: "id" });
    db.Course.hasMany(db.Post,               { foreignKey: "courseID", sourceKey: "id" });
//                                                     Post.courseID는      Course.id를 참조한다.
  }
}

module.exports = Course;
