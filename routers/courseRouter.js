const express = require("express");
const { Course, User, CommonDetailCode } = require("../models/index");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth_middleware");
const Student = require("../models/student");
const { format } = require("date-fns");

// 신규 강좌 등록
router.post("/", async (req, res, next) => {
  const { courseName, cmDtCd, courseDesc, startDate, endDate, userID } =
    req.body;
  const newCourse = {
    courseName,
    cmDtCd: parseInt(cmDtCd),
    courseDesc,
    startDate,
    endDate,
    userID: parseInt(userID),
  };

  // console.log(newCourse);

  try {
    const result = await Course.create(newCourse);
    res.status(200).json({
      success: true,
      document: [result],
      message: "course 등록 성공",
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "course 등록 실패",
      error: error.message,
    });
    next(error, req, res);
  }
});

// 강좌 수정
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const updateCourse = await Course.update(data, {
      where: { id },
    });
    // console.log(updateCourse);
    res.status(200).json({
      success: true,
      message: "course 수정 성공",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "course 수정 실패",
      error: error.message,
    });
  }
});

// 강좌 삭제
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleteCourse = await Course.destroy({ where: { id } });

    const courses = await Course.findAll({
      where: {
        id: id,
      },
    });

    if (courses[0] == null) {
      res.status(200).json({
        success: true,
        message: "삭제할 강좌가 없습니다.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "course 삭제 성공",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "course 삭제 실패",
      error: error.message,
    });
  }
});

// 강좌 목록 가져오기 -> 학생/선생님 권한 나누기
router.get("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    let tempProfileImage = "default.jpg";

    // console.log(uid);
    const user = await User.findOne({
      attributes: ["userID", "userName", "authCd", "profileImage"],
      where: {
        userID: uid,
      },
    });
    // console.log(user);
    if (user.profileImage != null) {
      tempProfileImage = user.profileImage;
    }
    // console.log(tempProfileImage);

    //선생님일 때
    if (user.authCd == "AUTH01") {
      const courses = await Course.findAll({
        attributes: [
          "id",
          "cmDtCd",
          "courseName",
          "courseDesc",
          "startDate",
          "endDate",
          "userID",
        ],
        include: [
          {
            model: CommonDetailCode,
            attributes: ["cmDtName"],
            where: {
              cmCd: "CMCD01",
            },
          },
          {
            model: User,
            attributes: ["userID", "userName"],
          },
        ],

        where: {
          userID: uid,
        },
        order: [["courseName", "ASC"]],
      });
      // console.log(courses);

      const result = {
        userID: user.userID,
        userName: user.userName,
        profileImage: tempProfileImage,
        courses: courses.map((course) => {
          return {
            id: course.id,
            cmDtCd: course.cmDtCd,
            cmDtName: course.CommonDetailCode.cmDtName,
            courseName: course.courseName,
            courseDesc: course.courseDesc,
            startDate: format(new Date(course.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(course.endDate), "yyyy-MM-dd"),
            userID: course.userID,
            teacherName: course.User.userName,
          };
        }),
      };

      res.status(200).json({
        success: true,
        courses: result,
        message: "담당 강좌 목록 조회 성공",
      });
      // 학생일 때
    } else if (user.authCd == "AUTH02") {
      //수강생 테이블에 존재하는지 확인
      const student = await Student.findAll({
        attributes: ["id", "userID", "courseID"],
        where: {
          userID: uid,
        },
      });

      if (student[0] == null) {
        const result = {
          userID: user.userID,
          userName: user.userName,
          profileImage: tempProfileImage,
          courses: [],
        };
        res.status(200).json({
          success: true,
          courses: result,
          message: "수강중인 강좌가 없습니다.",
        });
      } else {
        const courses = await Course.findAll({
          attributes: [
            "id",
            "cmDtCd",
            "courseName",
            "courseDesc",
            "startDate",
            "endDate",
            "userID",
          ],
          include: [
            {
              model: Student,
              attributes: ["id", "userID", "courseID"],
              where: {
                userID: uid,
              },
              required: true,
              include: {
                model: User,
                attributes: ["userID", "userName", "mobile"],
              },
            },
            {
              model: CommonDetailCode,
              attributes: ["cmDtCd", "cmDtName"],
              where: {
                cmCd: "CMCD01",
              },
            },
          ],
          order: [["courseName", "ASC"]],
        });

        const result = {
          userID: user.userID,
          userName: user.userName,
          profileImage: tempProfileImage,
          // profileImage: user.profileImage,
          courses: courses.map((course) => {
            return {
              id: course.id,
              cmDtCd: course.cmDtCd,
              cmDtName: course.CommonDetailCode.cmDtName,
              courseName: course.courseName,
              courseDesc: course.courseDesc,
              startDate: format(new Date(course.startDate), "yyyy-MM-dd"),
              endDate: format(new Date(course.endDate), "yyyy-MM-dd"),
              userID: course.userID,
              teacherName: "",
            };
          }),
        };

        res.status(200).json({
          success: true,
          courses: result,
          message: "수강중인 목록 조회 성공",
        });
      }
    } else {
      res.status(200).json({
        success: true,
        message: "당신은 선생님/학생이 아닙니다.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "강좌 목록 조회 실패",
      error: error.message,
    });
  }
});

module.exports = router;
