const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        courseID: { // 강좌 ID
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          comment: '강좌 ID',
        },
        postID: { // 게시글 ID
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          comment: '게시글 ID',
        },
        commentID: { // 댓글 ID
          type: Sequelize.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          comment: '댓글 ID',
        },
        writerID: { // 작성자 ID (선생님만 작성 가능)
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '작성자 ID (선생님만 작성 가능)',
        },
        content: { // 댓글 내용
          type: Sequelize.TEXT,
          allowNull: false,
          comment: '댓글 내용',
        },
      },
      {
        sequelize,
        timestamps: true,   // true면 sequelize가 자동으로 createdAt, updatedAt 컬럼 관리
        // paranoid: false, // 소프트 삭제 비활성화
        modelName: 'Comment', // 모델명
        tableName: 'comment', // 테이블명
      }
    );
  }

  // 최종 검증 끝나면 추가
  static associate(db) {
    db.Comment.belongsTo(db.Post, { foreignKey: 'postID',   targetKey: 'postID', });
    db.Comment.belongsTo(db.User, { foreignKey: 'writerID', targetKey: 'userID', });
//                                      Comment의 writerID는       User의.userID를 참조한다.
  }
}

module.exports = Comment;