const notiDao = require("../dao/notificationDao");
const apn = require("apn");

const createPushNotifications = async ({ courseID, title, content, postID, cmDtCd }) => {
  // 알림 공통 정보 초기화하기
  let notification;
  let userTokens = [];

  // 과정 이름 가져오기
  const course = await notiDao.findCourseInfo(courseID);
  const courseName = course.courseName ?? "Unknown";

  // 센터 정보 하드코딩: 추후 센터 추가될 때는 req에서 센터 id만 전달받아서 이름을 조회하기
  const centerID = 1;
  const centerName = "남부여성발전소";

  // 알림 정보에 담기
  let notificationInfo = {
    notiSubtitle: `${centerName}`,
  };

  // cmDtCd에 따라 알림 내용 업데이트하기
  switch (cmDtCd) {
    // 공지사항 알림 전송하기
    case 1:
      // 알림을 받을 회원: 현재 과정의 수강생들
      console.log("switch (cmDtCd) =", cmDtCd);
      const students = await notiDao.findDeviceTokens(courseID);

      console.log("students=", students);
      userTokens = students
        .flatMap((student) => {
          // DAO에서 반환되는 Student 객체의 dataValues에서 User 배열을 가져오기
          const user = student.dataValues.User;
          // user가 단일 객체라면, 그 객체의 deviceToken을 배열로 반환하기
          if (user && user.deviceToken) {
            return user.deviceToken;
          }
          return [];
        })
        .filter((token) => token !== undefined);
      break;

    // 문의글 알림 전송하기
    case 2:
      // 알림을 받을 회원: 과정의 담당자
      console.log("switch (cmDtCd) =", cmDtCd);
      const teacherID = course ? course.userID : null;
      const teacher = await notiDao.findDeviceTokenByUserID(teacherID);
      console.log("teacher=", teacher);
      userTokens = teacher.dataValues.deviceToken;
      title = `${title} 문의글 등록`;
      break;

    // 문의글 답변 알림 전송하기
    default:
      // 알림을 받을 회원: 최초 글 작성자
      const post = await notiDao.findPostInfo(postID);
      const authorID = post ? post.dataValues.writerID : null;
      const author = await notiDao.findDeviceTokenByUserID(authorID);
      userTokens = author.dataValues.deviceToken;
      title = `${courseName} 과정 문의글 답변 등록`;
      break;
  }

  // 알림 정보에 필요한 정보들 추가하기
  notificationInfo.notiTitle = title;
  notificationInfo.notiContents = content;
  notificationInfo.userTokens = userTokens;

  notification = notificationInfo;

  // 매핑된 최종 알림 목록을 가지고 알람 전송 함수 실행하기
  try {
    return await sendPushNotifications(notification);
  } catch (error) {
    console.log(error);
  }
};

// 알람 제목과 내용을 전달 받아 푸쉬 알람을 실제로 전송하는 함수
const sendPushNotifications = async (notification) => {
  let { notiTitle, notiSubtitle, notiContents, userTokens } = notification;

  // APNs 인증에 필요한 token 정보를 담아 APNs Provider 인스턴싱하기
  var option = {
    token: {
      key: process.env.APNS_KEY, // APNs 인증 키 파일 경로
      keyId: process.env.APNS_KEY_ID, // 인증 키의 ID
      teamId: process.env.APNS_TEAM_ID, // Apple 개발자 계정의 팀 ID
    },
    production: false, // 배포 환경 설정하기: 앱스토어에 배포 시 true로 변경하기
  };
  apnProvider = apn.Provider(option);

  // noti라는 이름의 알림 객체 인스턴싱하기
  var noti = new apn.Notification();

  // 알림 객체에 다양한 attributes 추가하기
  noti.sound = "default"; // 알림의 소리 지정하기: 지정하지 않을 시에는 효과음 없이 전송
  noti.alert = {
    // 알림의 내용 지정하기
    title: notiTitle,
    subtitle: notiSubtitle,
    body: notiContents,
  };
  noti.topic = process.env.APNS_BUNDLE_ID; // 알림을 보낼 앱의 식별자 지정하기

  try {
    const result = await apnProvider.send(noti, userTokens); // 알림 내용과 deviceToken들을 담아 전송하기
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = { createPushNotifications };
