const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        courseID: { // 강좌 ID
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          comment: '강좌 ID',
        },
        cmDtCd: { // 기초 상세코드
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          comment: '기초 상세코드',
        },
        postID: { // 게시글 ID
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
          comment: '게시글 ID',
        },
        writerID: { // 작성자 ID
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '작성자 ID',
        },
        title: { // 제목
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: '제목, 최대 100자',
        },
        content: { // 내용
          type: Sequelize.TEXT,
          allowNull: false,
          comment: '내용, 큰 데이터라 TEXT 타입',
        },
        // fileName: { // 업로드 파일명. 별도 테이블 분리
        //   type: Sequelize.STRING(200),
        //   allowNull: true,
        // },
      },
      {
        sequelize,
        timestamps: true,   // true면 sequelize가 자동으로 createdAt, updatedAt 컬럼 관리
        // paranoid: false, // 소프트 삭제 비활성화
        modelName: 'Post', // 모델명
        tableName: 'post', // DB 테이블명
      }
    );
  }

  // 최종 검증 끝나면 추가
  static associate(db) {
    db.Post.belongsTo(db.User,             { foreignKey: 'writerID', targetKey: 'userID', });
    db.Post.belongsTo(db.CommonDetailCode, { foreignKey: 'cmDtCd',   targetKey: 'cmDtCd' });
    db.Post.belongsTo(db.Course,           { foreignKey: 'courseID', targetKey: 'id', });
//                                                   Post.courseID는       Course.id를 참조한다.

    db.Post.hasMany(db.Comment,      { foreignKey: 'postID', sourceKey: 'postID' });
    db.Post.hasMany(db.AttachedFile, { foreignKey: 'postID', sourceKey: 'postID' });
//                                     AttachedFile.postID는         Post.postID를 참조한다.
  }
}

module.exports = Post;