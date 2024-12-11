const Sequelize = require('sequelize');

class CommonCode extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        cmCd: { // 기초코드
          type: Sequelize.STRING(25),
          allowNull: false,
          primaryKey: true,
          unique: true,
          comment: '기초코드',
        },
        cmName: { // 기초코드명
          type: Sequelize.STRING(25),
          allowNull: false,
          comment: '기초코드명',
        },
      },
      {
        sequelize,
        id : false,        // sequelize의 id 자동생성 비활성화 (명시 필수)
        timestamps: false, // sequelize의 createdAt,updatedAt 자동생성 비활성화 (명시 필수)
        modelName: 'CommonCode', // 모델명
        tableName: 'commonCode', // DB 테이블명
      }
    );
  }
  
  static associate(db) {
    db.CommonCode.hasMany(db.CommonDetailCode, { foreignKey: 'cmCd', sourceKey: 'cmCd' });
//                                           CommonDetailCode.cmCd는  CommonCode.cmDtCd를 참조한다.

  }

}

module.exports = CommonCode;