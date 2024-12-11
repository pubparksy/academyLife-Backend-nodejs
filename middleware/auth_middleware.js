// 로그인을 검증해주는 미들웨어
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1]; // 띄어쓰기를 기준으로 2개의 값으로 분리: 실제 토큰의 값은 [1]번째 값
  }
  if (!token) res.sendStatus(401);

  jwt.verify(token, secret, (error, user) => {
    if (error)
      res.sendStatus(403).json({
        message: "유효하지 않은 token",
      });
    req.user = user;
    next(); // 다음 미들웨어로 제어를 넘기고, 다음 미들웨어가 없을 시 현재 미들웨어를 장착한 라우터가 실행
  });
};

module.exports = authenticateToken;
