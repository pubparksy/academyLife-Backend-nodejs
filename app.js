// require("./models/sync")(); // DB에 Table 초기 생성할 때만 주석 해제

const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const PORT = 3000;
const app = express();

// Swagger 설정 추가 (YAML)
const cors = require("cors");
app.use(cors());

const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const swaggerDocument = yaml.load("./swagger.yml"); // YAML 파일 로드
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/** router 가져오기 */
const errorHandler = require("./middleware/errorHandler"); // 미들웨어 폴더로 이동
const authenticateToken = require("./middleware/auth_middleware");
const authRouter = require("./routers/authRouter");
const courseRouter = require("./routers/courseRouter");
const attendanceLogRouter = require("./routers/attendanceLogRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const imageRouter = require("./routers/imageRouter");
const notificationRouter = require("./routers/notificationRouter");
const apnsRouter = require("./routers/apnsRouter");
const teacherRouter = require("./routers/teacherRouter");
const studentRouter = require("./routers/studentRouter");
const commonRouter = require("./routers/commonRouter");
const openAIRouter = require("./routers/openAIRouter");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** 도메인 뒤 경로 설정   ag) GET localhost:3000/posts/1 = 1번 게시글 조회 */
app.use("/user", authRouter, errorHandler); // user 라우터에서 에러 발생 시 errorHandler를 이용해 에러 처리
app.use("/courses", authenticateToken, courseRouter, errorHandler);
app.use("/attendances", authenticateToken, attendanceLogRouter, errorHandler); // jwt인증 > 출석체크  > 오류 핸들러
app.use("/posts", authenticateToken, postRouter, errorHandler); // jwt인증 > 게시글댓글 > 오류 핸들러
app.use("/post", authenticateToken, commentRouter, errorHandler); // jwt인증 > 게시글댓글 > 오류 핸들러
app.use("/images", imageRouter);
app.use("/notification", notificationRouter, errorHandler);
app.use("/apns", apnsRouter, errorHandler);
app.use("/teacher", authenticateToken, teacherRouter, errorHandler);
app.use("/student", authenticateToken, studentRouter, errorHandler);
app.use("/common", authenticateToken, commonRouter, errorHandler);
app.use("/openai", authenticateToken, openAIRouter, errorHandler);

app.use((_, res) => {
  res.status(404).json({
    message: "[Timi] 존재하지 않는 API입니다. 라우터와 HTTP method를 확인하세요.",
  });
});

const port = process.env.PORT || PORT;
app.listen(port, () => {
  console.log(`[Timi] Server is listening at ${port}`);
});
