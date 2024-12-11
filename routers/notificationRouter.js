const express = require("express");
const { findAllNotificationsByUserID, createNotifications, changeNotificationStatus } = require("../controllers/notificationController"); // Postman 테스트용 라우터
const router = express.Router();

router.post("/", createNotifications); // Postman 테스트용 라우터
router.get("/:userID", findAllNotificationsByUserID);
router.patch("/:notiID", changeNotificationStatus);

/* 
알림 관련 라우트
GET     /notification/:userID           # 특정 회원의 알림 조회
PATCH   /notification/:notificationID   # 알림 확인 (isRead 컬럼을 true로 update)
*/

module.exports = router;
