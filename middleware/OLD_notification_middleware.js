// 알림 관련 미들웨어
const notiService = require("../services/notificationService");

// 통합 알림
const createNotification = async (req, res, next) => {
  const { courseID, title, content, postID, cmDtCd } = req.body;

  try {
    const notification = await notiService.createNotification({ courseID, title, content, postID, cmDtCd });
    return res.status(201).json({ notification: notification });
  } catch (error) {
    next(error, req, res);
  }
};

module.exports = {
  createNotification,
  // createAnnouncementNotification,
  // createPostNotification,
};
