const Sequelize = require('sequelize');

class AuthCode extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        authID: { // 권한코드
          type: Sequelize.STRING(10),
          allowNull: false,
          primaryKey: true,
          unique: true,
          comment: '권한코드',
        },
        authName: { // 권한명
          type: Sequelize.STRING(10),
          allowNull: false,
          comment: '권한명',
        },
      },
      {
        sequelize,
        id : false,        // sequelize의 id 자동생성 비활성화 (명시 필수)
        timestamps: false, // sequelize의 createdAt,updatedAt 자동생성 비활성화 (명시 필수)
        modelName: 'AuthCode', // 모델명
        tableName: 'authCode', // DB 테이블명
      }
    );
  }

  static associate(db) {
    db.AuthCode.hasMany(db.User,        { foreignKey: "authCd", sourceKey: "authID" });
//                                                User.authCd는    AuthCode.authID를 FK 참조한다.
  }
}

module.exports = AuthCode;