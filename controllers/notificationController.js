const notiService = require("../services/notificationService");
const apnsService = require("../services/apnsService");
const models = require("../models");

// Postman 테스트용 컨트롤러
const createNotifications = async (req, res, next) => {
  const { courseID, title, content, postID, cmDtCd } = req.body;

  // 시퀄라이저 에러 출력을 위한 디버깅 코드
  // const notification = await notiService.createNotifications({ courseID, title, content, postID, cmDtCd });

  try {
    const notification = await notiService.createNotifications({ courseID, title, content, postID, cmDtCd });
    return res.status(201).json({ notification: notification });
  } catch (error) {
    next(error, req, res);
  }
};

// Postman 테스트용 컨트롤러
const createPushNotifications = async (req, res, next) => {
  const { courseID, title, content, postID, cmDtCd } = req.body;

  // 시퀄라이저 에러 출력을 위한 디버깅 코드
  // const notifications = await apnsService.createPushNotifications({ courseID, title, content, postID, cmDtCd });
  try {
    const notifications = await apnsService.createPushNotifications({ courseID, title, content, postID, cmDtCd });
    return res.status(201).json({ notifications: notifications });
  } catch (error) {
    next(error, req, res);
  }
};

const findAllNotificationsByUserID = async (req, res, next) => {
  const { userID } = req.params;

  try {
    const notifications = await notiService.findAllNotificationsByUserID(userID);
    return res.status(201).json({ notification: notifications });
  } catch (error) {
    next(error, req, res);
  }
};

const changeNotificationStatus = async (req, res, next) => {
  const { notiID } = req.params;
  try {
    await notiService.changeNotificationStatus(notiID);
    return res.status(201).json({ status: "success" });
  } catch (error) {
    next(error, req, res);
  }
};

module.exports = {
  createNotifications,
  findAllNotificationsByUserID,
  changeNotificationStatus,
  createPushNotifications,
};
