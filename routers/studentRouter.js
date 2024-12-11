const express = require("express");
const { Course, User, CommonDetailCode } = require("../models/index");
const router = express.Router();
const Student = require("../models/student");
const { formatPhoneNumber } = require("../utils/commonUtils");

// 강좌별 수강생 목록 조회 -> 수강생 추가 화면에서 사용할 것
router.get("/course/:cid", async (req, res) => {
  const cid = req.params.cid;

  const students = await Student.findAll({
    where: {
      courseID: cid,
    },
    include: {
      model: User,
      attributes: ["userID", "userName", "mobile"],
    },
  });

  const result = students.map((user) => {
    return {
      id: user.id,
      courseID: user.courseID,
      userID: user.userID,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      User: {
        userID: user.User.userID,
        userName: user.User.userName,
        mobile: formatPhoneNumber(user.User.mobile),
      },
    };
  });

  //userID만 가져오는 상태
  res.status(200).json({
    success: true,
    students: result,
    message: "강좌별 수강생 정보 가져오기 성공",
  });
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "강좌별 수강생 정보 가져오기 실패",
    });
  }
});

module.exports = router;
