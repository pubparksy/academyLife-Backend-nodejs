const Sequelize = require('sequelize');

class AttendanceLog extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        attendanceID: { // 출석 ID
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          comment: '출석 ID',
        },
        userID: { // 출석 학생 ID
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '출석 학생 ID',
        },
        courseID: { // 강좌 ID
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: '강좌 ID',
        },
        entryTime: {  // 입실 일시
          type: Sequelize.DATE,
          allowNull: false,
          comment: '출석 일시',
        },
        exitTime: {  // 퇴실 일시
          type: Sequelize.DATE,
          allowNull: true,
          comment: '퇴실 일시',
        },
        entryStatus: { // 입실 상태
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: '입실 상태',
        },
        exitStatus: { // 퇴실 상태
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: '퇴실 상태',
        },
      },
      {
        sequelize,
        timestamps: true,   // true면 sequelize가 자동으로 createdAt, updatedAt 컬럼 관리
        modelName: 'AttendanceLog', // 모델명
        tableName: 'attendanceLog', // DB 테이블명
      }
    );
  }
  
  // 최종 검증 끝나면 추가
  static associate(db) {
    db.AttendanceLog.belongsTo(db.Course,  { foreignKey: 'courseID', targetKey: 'id' });
    db.AttendanceLog.belongsTo(db.Student, { foreignKey: 'userID',   targetKey: 'userID' });
//                                          AttendanceLog.userID는       Student.userID를 참조한다.

    // db.AttendanceLog.belongsTo(db.User,    { foreignKey: 'userID',   targetKey: 'userID' });

  }
}

module.exports = AttendanceLog;