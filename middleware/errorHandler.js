const { Sequelize } = require("sequelize");

const errorHandler = (error, req, res, next) => {
  console.log("======error handler========");
  if (error instanceof Sequelize.UniqueConstraintError) {
    return res.status(409).json({ message: "중복 제약 위배" });
  } else if (error instanceof Sequelize.ValidationError) {
    return res.status(400).json({ message: "잘못된 데이터 타입" });
  } else if (error instanceof Sequelize.ForeignKeyConstraintError) {
    return res.status(400).json({ message: "외래키 제약 위배" });
  } else if (error instanceof Sequelize.ConnectionError || error instanceof Sequelize.ConnectionRefusedError) {
    return res.status(500).json({ message: "데이터베이스 연결 실패" });
  } else if (error instanceof Sequelize.TimeoutError) {
    return res.status(504).json({ message: "질의문 실행 시간 초과" });
  } else {
    return res.status(500).json({ message: "기타 서버 에러" });
  }
};

module.exports = errorHandler;
