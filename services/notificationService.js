const notiDao = require("../dao/notificationDao");

const createNotifications = async ({ courseID, title, content, postID, cmDtCd }) => {
  // 알림 공통 정보 초기화하기
  let notification;
  let userID = 0;

  // 과정 이름 가져오기
  const course = await notiDao.findCourseInfo(courseID);
  const courseName = course.courseName;

  // 센터 정보 하드코딩: 추후 센터 추가될 때는 req에서 센터 id만 전달받아서 이름을 조회하기
  const centerID = 1;
  const centerName = "남부여성발전소";

  // 알림 정보에 담기
  let notificationInfo = {
    courseID,
    courseName: courseName,
    postID,
    centerID: centerID,
    centerName: centerName,
  };

  // cmDtCd에 따라 각기 다른 dao를 실행하기
  switch (cmDtCd) {
    // 공지사항 알림 전송하기
    case 1:
      // 알림 정보에 필요한 정보들 추가하기
      notificationInfo.notiGroupCd = "1";
      notificationInfo.notiTitle = title;
      notificationInfo.notiContents = content;

      // 알림을 받을 회원들의 목록을 구해 array로 저장하기
      const users = await notiDao.findUsers(courseID);
      const userIDs = users.map((user) => user.userID);

      // 알림 정보를 토대로 회원별로 알림을 생성하기 위해 매핑 함수 실행하기
      const notifications = generateNotificationRows(userIDs, notificationInfo);

      // 매핑된 최종 알림 목록을 가지고 Dao 실행하기
      return await notiDao.createAnnouncementNotification(notifications);

    // 문의글 알림 전송하기
    case 2:
      // 문의사항의 알림은 과정의 담당자에게 전달돼야 하므로, 과정 담당자의 ID를 가져오기
      userID = course ? course.userID : null;

      // 알림 정보에 필요한 정보들 추가하기
      notificationInfo.userID = userID; // 과정 담당자로 업데이트
      notificationInfo.notiGroupCd = "2";
      notificationInfo.notiTitle = `${title} 문의글 등록`;

      // 최종 알림 내용을 가지고 Dao 실행하기
      notification = notificationInfo;
      return await notiDao.createBoardNotification(notification);

    // 문의글 답변 알림 전송하기
    default:
      // 문의사항 답변의 알림은 최초 글 작성자에게 전달돼야 하므로, 글 작성자의 ID를 가져오기
      const post = await notiDao.findPostInfo(postID);
      userID = post ? post.dataValues.writerID : null;

      // 알림 정보에 필요한 정보들 추가하기
      notificationInfo.notiGroupCd = "3";
      notificationInfo.userID = userID; // 글 최초 작성자로 업데이트
      notificationInfo.notiTitle = `${courseName} 과정 문의글 답변 등록`;
      // notificationInfo.notiContents = content;

      // 최종 알림 내용을 가지고 Dao 실행하기
      notification = notificationInfo;
      return await notiDao.createBoardNotification(notification);
  }
};

const findAllNotificationsByUserID = async (userID) => {
  return await notiDao.findAllNotificationsByUserID(userID);
};

const changeNotificationStatus = async (notiID) => {
  return await notiDao.changeNotificationStatus(notiID);
};

// 동일한 내용의 알람을 여러명에게 전송할 때 알람 내용과 대상자를 매핑해 배열로 담아주는 함수
function generateNotificationRows(userIDs, notiInfo) {
  return userIDs.map((user) => ({
    ...notiInfo,
    userID: user,
  }));
}

module.exports = {
  createNotifications, // 통합 알림 전송
  findAllNotificationsByUserID,
  changeNotificationStatus,
};
