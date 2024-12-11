const express = require("express");
const { Course, User, CommonDetailCode } = require("../models/index");
const router = express.Router();
const Student = require("../models/student");
const { where } = require("sequelize");
const { format } = require("date-fns");
const { formatPhoneNumber } = require("../utils/commonUtils");

// 수강생 추가를 위한 회원 목록 조회 (학생인 회원만 조회)
router.get("/:uid/:cid/students", async (req, res) => {
  try {
    const uid = req.params.uid; //선생님 권한 가진 userID
    const cid = req.params.cid;
    const teacher = await User.findAll({
      attributes: ["userID", "authCd"],
      where: {
        userID: uid,
      },
    });
    // console.log("선생님", teacher);
    if (teacher[0].authCd == "AUTH01") {
      const auth02users = await User.findAll({
        attributes: ["userID", "userName", "mobile"],
        where: {
          authCd: "AUTH02",
        },
        order: [["userName", "ASC"]],
      });

      const formatUsers = auth02users.map((user) => {
        return {
          userID: user.userID,
          userName: user.userName,
          mobile: formatPhoneNumber(user.mobile),
        };
      });

      const students = await Student.findAll({
        attributes: ["userID", "courseID"],
        where: {
          courseID: cid,
        },
      });
      // console.log(students);
      res.status(200).json({
        success: true,
        teacher: teacher,
        users: formatUsers,
        students: students,
        message: "학생 권한 가진 유저 가져오기 성공",
      });
    } else {
      res.status(200).json({
        success: true,
        teacher: teacher,
        message: "당신은 선생님이 아닙니다.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "학생 권한 가진 유저 가져오기 실패",
    });
  }
});

//수강생 저장
router.post("/save/students", async (req, res) => {
  try {
    const { courseID, students } = req.body;
    // console.log(students);

    if (students[0] == null) {
      await Student.destroy({
        where: {
          courseID: courseID,
        },
      });
    }

    //기존 강좌에 등록된 수강생 모두 삭제
    for (const student of students) {
      await Student.destroy({
        where: {
          courseID: courseID,
        },
      });
    }

    //강좌에 수강생 추가/수정
    const addStudent = []; // 수강생 추가 배열
    for (const student of students) {
      const courseStudent = await Student.create({
        courseID: courseID,
        userID: student.userID,
      });
      addStudent.push(courseStudent);
    }

    res.status(200).json({
      success: true,
      message: "수강생 추가 및 수정 성공",
      students: addStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "수강생 수정 및 삭제 실패",
    });
  }
});

//AUTH01 권한 가진 유저 보여주기 (담당자 Picker를 위한)
router.get("/num/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const teachers = await User.findAll({
      attributes: ["userName", "userID"],
      where: {
        authCd: `AUTH0${id}`,
      },
    });
    res.status(200).json({
      success: true,
      teachers: teachers,
      message: "선생님 목록 조회 성공",
    });
    // console.log(teachers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

//강좌 관리에서 선택한 하나의 강좌에 대한 정보 가져오기
router.get("/:uid/:cid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const cid = req.params.cid;

    // console.log(uid);
    // console.log(cid);

    const course = await Course.findOne({
      attributes: [
        "id",
        "cmDtCd",
        "courseName",
        "courseDesc",
        "startDate",
        "endDate",
        "userID",
      ],
      where: {
        userID: uid,
        id: cid,
      },
      include: {
        model: User, // 강좌와 함께 선생님 정보도 조회
      },
    });

    //강좌가 하나도 없을 때
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "강좌를 찾을 수 없습니다.",
      });
    }

    const result = {
      ...course.dataValues, // 기존 데이터 복사
      startDate: format(new Date(course.startDate), "yyyy-MM-dd"), // 날짜 변환
      endDate: format(new Date(course.endDate), "yyyy-MM-dd"),
    };
    // console.log(result);
    res.status(200).json({
      success: true,
      courses: [result],
      message: "강좌 정보 불러오기 성공",
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
});
module.exports = router;
