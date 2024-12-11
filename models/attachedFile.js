const Sequelize = require('sequelize');

class AttachedFile extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {              
        // postID: { // 게시글 ID
        //   type: Sequelize.INTEGER,
        //   primaryKey: true,
        //   autoIncrement: true,
        //   allowNull: false,
        //   comment: '게시글 ID',
        // },
        fileName: { // 첨부 파일 이름
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: '첨부 파일 이름',
        },
        postID: { // 게시글 ID
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '게시글 ID',
          },
      },
      {
        sequelize,
        timestamps: true,   // true면 sequelize가 자동으로 createdAt, updatedAt 컬럼 관리
        modelName: 'AttachedFile', // 모델명
        tableName: 'attachedFile', // DB 테이블명
      }
    );
  }


  static associate(db) {
    db.AttachedFile.belongsTo(db.Post, { foreignKey: 'postID',  targetKey: 'postID' });
//                                      AttachedFile.postID는          Post.postID를 참조한다.
  }
}

module.exports = AttachedFile;