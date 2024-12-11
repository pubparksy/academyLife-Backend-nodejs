const Sequelize = require("sequelize");
const process = require("process");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const db = {};
let sequelize = new Sequelize(config.database, config.username, config.password, config);

// Model 가져오기
const AuthCode = require("./authCode"); // 권한코드
const CommonCode = require("./commonCode"); // 기초코드
const CommonDetailCode = require("./commonDetailCode"); // 기초상세코드
const User = require("./user"); // 회원
const Course = require("./course"); // 강좌
const Student = require("./student"); // 수강생
const AttendanceLog = require("./attendanceLog"); // 출석체크 로그
const Post = require("./post"); // 게시글
const Comment = require("./comment"); // 댓글
const AttachedFile = require("./attachedFile"); // 첨부파일
const Notification = require("./notification"); // 알림

// DB 테이블 초기화
AuthCode.init(sequelize);
CommonCode.init(sequelize);
CommonDetailCode.init(sequelize);
User.init(sequelize);
Course.init(sequelize);
Student.init(sequelize);
AttendanceLog.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
AttachedFile.init(sequelize);
Notification.init(sequelize);

// Model을 DB에 저장
db.AuthCode = AuthCode;
db.CommonCode = CommonCode;
db.CommonDetailCode = CommonDetailCode;
db.User = User;
db.Course = Course;
db.AttendanceLog = AttendanceLog;
db.Post = Post;
db.Comment = Comment;
db.AttachedFile = AttachedFile;
db.Student = Student;
db.Notification = Notification;

// db fk 설정 등록
db.AuthCode.associate(db);
db.CommonCode.associate(db);
db.CommonDetailCode.associate(db);
db.User.associate(db); 
db.Course.associate(db);
db.Student.associate(db);
db.AttendanceLog.associate(db);
db.Post.associate(db);
db.Comment.associate(db);
db.AttachedFile.associate(db);
// db.Notification.associate(db);   // 주석 풀면 TypeError: db.Notification.associate is not a function 오류 발생

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
