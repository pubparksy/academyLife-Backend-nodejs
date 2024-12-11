// 알림 생성 함수
const notiService = require("../services/notificationService");
const apnsService = require("../services/apnsService");

// 알림 생성 함수 실행 예시
// const notification = await createNotifications({
//   courseID: req.body.courseID,
//   title: req.body.title,
//   content: req.body.content,
//   postID: req.body.postID,
//   cmDtCd: req.body.cmDtCd
// })

// 알림 실행 함수
const createNotifications = async ({ courseID, title, content, postID, cmDtCd }) => {
  console.log("createNotifications =======================> courseID=", courseID, ", title=", title, ", content=", content, ", postID=", postID, ", cmDtCd=", cmDtCd);
  if (!courseID || !content || !postID) {
    throw new Error("필수 인자 courseID, content, postID 중 누락된 인자가 있습니다.");
  }

  // notification 생성 서비스 호출하기
  const notification = await notiService.createNotifications({ courseID, title, content, postID, cmDtCd });
  const pushNotification = await apnsService.createPushNotifications({ courseID, title, content, postID, cmDtCd });
  return notification, pushNotification;
};

module.exports = {
  createNotifications,
};
