const { Sequelize, Model, DataType } = require("sequelize");

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true, // 이메일 형식 검증
            len: [1, 254], // 최대 254 문자까지 저장
          },
        },
        authCd: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        password: {
          type: Sequelize.TEXT,
          allowNull: true, // 소셜 로그인 유저들을 고려해 Not Null로 수정
        },
        userName: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        nickname: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        profileImage: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        mobile: {
          type: Sequelize.STRING(11),
          allowNull: false,
        },
        isDeleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        deviceToken: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        kakao: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        google: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        apple: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        registerRef: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        modelName: "User",
        tableName: "user",
      }
    );
  }

  static associate(db) {

    db.User.belongsTo(db.AuthCode,    { foreignKey: 'authCd', targetKey: 'authID' });
//                                            User의 authCd는   AuthCode의 authID를 FK 참조한다.

    db.User.hasMany(db.Course,        { foreignKey: "userID", sourceKey: "userID" });
    db.User.hasMany(db.Student,       { foreignKey: "userID", sourceKey: "userID" });
    db.User.hasMany(db.Post,          { foreignKey: "writerID", sourceKey: "userID" });
    db.User.hasMany(db.Comment,       { foreignKey: "writerID", sourceKey: "userID" });
//                                           Comment.writerID는        User.userID를 FK 참조한다.

    // db.User.hasMany(db.AttendanceLog, { foreignKey: "userID", sourceKey: "userID" });
  }
}

module.exports = User;
