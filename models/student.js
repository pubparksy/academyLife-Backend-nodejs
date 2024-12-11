const Sequelize = require("sequelize");

class Student extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          autoIncrement: true,
        },
        courseID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        userID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: "Student",
        tableName: "student",
      }
    );
  }
  static associate(db) {
    db.Student.belongsTo(db.User,        { foreignKey: "userID",   targetKey: "userID" });
    db.Student.belongsTo(db.Course,      { foreignKey: "courseID", targetKey: "id" });
//                                              Student.courseID는      Course.id를 참조한다.

    db.Student.hasMany(db.AttendanceLog, { foreignKey: "userID",   sourceKey: "userID" });
//                                        AttendanceLog.userID는        Student.userID를 참조한다.
  }
}

module.exports = Student;
