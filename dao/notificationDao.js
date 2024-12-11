const models = require("../models");

const createAnnouncementNotification = async (notifications) => {
  return await models.Notification.bulkCreate(notifications);
};

const createBoardNotification = async (notification) => {
  return await models.Notification.create(notification);
};

const findAllNotificationsByUserID = async (userID) => {
  return await models.Notification.findAll({
    where: {
      userID,
      isRead: false,
      isDeleted: false,
    },
    order: [["notiID", "DESC"]],
  });
};

const changeNotificationStatus = async (notiID) => {
  return await models.Notification.update({ isRead: true }, { where: { notiID } });
};

const findUsers = async (courseID) => {
  return await models.Student.findAll({
    attributes: ["userID"],
    where: { courseID: courseID },
  });
};

const findCourseInfo = async (courseID) => {
  return await models.Course.findOne({
    attributes: ["courseName", "userID"],
    where: { id: courseID },
  });
};

const findPostInfo = async (postID) => {
  return await models.Post.findOne({
    attributes: ["writerID"],
    where: { postID: postID },
  });
};

const findDeviceTokens = async (courseID) => {
  return await models.Student.findAll({
    attributes: ["userID"],
    include: {
      model: models.User,
      attributes: ["userID", "deviceToken"],
      required: true, // Ensures INNER JOIN
    },
    where: {
      courseID,
    },
  });
};

const findDeviceTokenByUserID = async (userID) => {
  return await models.User.findOne({
    attributes: ["userID", "deviceToken"],
    where: {
      userID,
    },
  });
};

module.exports = {
  createAnnouncementNotification,
  createBoardNotification,
  findAllNotificationsByUserID,
  changeNotificationStatus,
  findUsers,
  findCourseInfo,
  findPostInfo,
  findDeviceTokens,
  findDeviceTokenByUserID,
};
