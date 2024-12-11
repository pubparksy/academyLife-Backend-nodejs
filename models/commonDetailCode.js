const Sequelize = require("sequelize");

class CommonDetailCode extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        cmCd: {
          // 기초코드
          type: Sequelize.STRING(25),
          primaryKey: true, // 복합식별자 1
          allowNull: false,
          comment: "기초코드",
        },
        cmDtCd: {
          // 기초상세코드
          type: Sequelize.INTEGER,
          primaryKey: true, // 복합식별자 2
          allowNull: false,
          comment: "기초상세코드",
        },
        cmDtName: {
          // 기초상세코드명
          type: Sequelize.STRING(25),
          allowNull: false,
          comment: "기초상세코드명",
        },
      },
      {
        sequelize,
        id: false, // sequelize의 id 자동생성 비활성화 (명시 필수)
        timestamps: false, // sequelize의 createdAt,updatedAt 자동생성 비활성화 (명시 필수)
        modelName: "CommonDetailCode", // 모델명
        tableName: "commonDetailCode", // DB 테이블명
      }
    );
  }

  static associate(db) {
    db.CommonDetailCode.belongsTo(db.CommonCode, { foreignKey: "cmCd", targetKey: "cmCd" });
//                                             CommonDetailCode.cmCd는   CommonCode.cmCd를 참조한다.

    db.CommonDetailCode.hasMany(db.Course,       { foreignKey: "cmDtCd",     sourceKey: "cmDtCd" });
    db.CommonDetailCode.hasMany(db.Post,         { foreignKey: "cmDtCd",     sourceKey: "cmDtCd" });
//                                                         Post.cmDtCd는 CommonDetailCode.cmDtCd를 참조한다.
  }
}

module.exports = CommonDetailCode;
