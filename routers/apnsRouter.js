const express = require("express");
const { createPushNotifications } = require("../controllers/notificationController"); // Postman 테스트용 라우터
const router = express.Router();

router.post("/push", createPushNotifications); // Postman 테스트용 라우터: 푸쉬 알림









// sypark 출석체크 미입실 학생 Push Notification
const apn = require("apn");
const { User, Course } = require("../models/index"); // Sequelize 때 사용
var optionEntry = {
  token: {
    key: process.env.APNS_KEY,
    keyId: process.env.APNS_KEY_ID,
    teamId: process.env.APNS_TEAM_ID,
  },
  production: false,
};
apnProvider = apn.Provider(optionEntry);
var notiEntry = new apn.Notification();

// http://localhost:3000/apns/entry/1/1
router.post("/entry/:cID/:sID", async (req, res) => {
  const { cID, sID } = req.params;

  // 학생 정보 가져오기
  const studentInfo = await User.findOne({
    attributes: ["userID", "userName", "deviceToken"],
    where: { userID: sID },
  });
  // 강좌명 가져오기
  const courseInfo = await Course.findOne({
    attributes: ["id", "courseName"],
    where: { id: cID },
  });

  // console.log("deviceToken > ", studentInfo.deviceToken);

  notiEntry.sound = "bell.mp3";

  notiEntry.alert = {
    // 내용 바꿔주기
    title: "[슬기로운 학원 생활] 푸시 알림",
    subtitle: `${courseInfo.courseName} 강좌 미입실 안내`,
    body: `${studentInfo.userName}님, 어서 ${courseInfo.courseName} 수업에 입실하세요`,
  };

  notiEntry.payload = { name: `${studentInfo.userName}` };
  notiEntry.topic = process.env.APNS_BUNDLE_ID;
  // console.log(notiEntry);

  apnProvider
    .send(notiEntry, studentInfo.deviceToken)
    .then((result) => {
      console.log("result:" + result);
      // res.json(result);
      res.status(201).json({ success: true, message: `미입실 학생 Push 발송 성공` });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ success: false, message: `미입실 학생 Push 발송 실패` });
      throw err;
    });
});

module.exports = router;
