const express = require('express');
const { User, Course, Student, AttendanceLog} = require('../models/index'); // Sequelize 때 사용
const { Sequelize, Op }= require("sequelize");
const { formatPhoneNumber, getCmDtNm, getUserNm, getCourseNm  } = require("../utils/commonUtils");
const { format } = require('date-fns');
const router = express.Router();
const todayYearMonthDay = format(new Date(), 'yyyy-MM-dd'); // 오늘이 강좌 기간 내에 해당되는 날인지

/** Beacon 비즈니스 로직 추가 후 개발 예정 */

/** [출석체크 메뉴] 학생 - 속한 강좌 목록 & 강좌별 입퇴실 상태 */
router.get("/student/:sID", async (req, res, next) => {
    const { sID } = req.params;
    // 오늘 날짜 설정
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    const sNm = await getUserNm(sID);
    try {
        // 1. 학생이 수강 중인 강좌 목록 조회
        const enrolledCourses = await Student.findAll({
            where: { userID: sID },
            include: [
                {
                    model: Course,
                    attributes: ['id', 'courseName', 'startDate', 'endDate'],
                },
                {
                    model: User,
                    attributes: ['userName', 'profileImage'], // User 정보
                },
            ],
            order: [[Course, 'courseName', 'ASC']], // 학생이 속한 강좌명 정렬 : 가나다 순
        });

        // 2. 오늘 날짜 기준으로 AttendanceLog 조회
        const attendanceLogs = await AttendanceLog.findAll({
            attributes: ['courseID', 'entryStatus', 'exitStatus'],
            where: {
                userID: sID,
                entryTime: { [Op.between]: [todayStart, todayEnd] },
            },
        });

        
        // 3. 데이터 재가공
        if (enrolledCourses.length > 0) {
            const studentData = {
                userID: Number(enrolledCourses[0].userID),
                userName: enrolledCourses[0].User.userName,
                profileImage: enrolledCourses[0].User.profileImage,
                courses: enrolledCourses.map(course => {
                    const attendance = attendanceLogs.find(
                        log => log.courseID === course.Course.id
                    );

                    var isCourseDateToday = false;
                    const startDate = format(course.Course.startDate, 'yyyy-MM-dd');
                    const endDate = format(course.Course.endDate, 'yyyy-MM-dd');

                    console.log("todayYearMonthDay = " , todayYearMonthDay);
                    console.log("format(course.startDate) = " , startDate);
                    console.log("format(course.endDate) = " , endDate);

                    console.log("todayYearMonthDay >= startDate = " , todayYearMonthDay >= startDate);
                    console.log("todayYearMonthDay <= endDate = " , todayYearMonthDay <= endDate);

                    if (todayYearMonthDay >= startDate
                        && todayYearMonthDay <= endDate) {
                        console.log("학생 - 오늘 이 수업은 출석하는 날이에요");
                        isCourseDateToday = true;
                    };

                    return {
                        courseID: course.Course.id,
                        courseName: course.Course.courseName,
                        startDate: startDate,
                        endDate: endDate,
                        isCourseDateToday : isCourseDateToday,
                        entryStatus: attendance ? attendance.entryStatus : false,
                        exitStatus: attendance ? attendance.exitStatus : false,
                    };
                }),
            };
            res.status(200).json({ success: true, documents: studentData, message: `${sNm} 학생 - 강좌 목록과 입퇴실 상태 조회 성공`, });
        } else {
            const studentData = {
                userID: Number(sID),
                userName: sNm,
                courses: [], // 빈 배열 유지
            };
            res.status(200).json({ success: true, documents: studentData, message: `${sNm} 학생 - 강좌 목록 없음` });
        }
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            next(error);
        }
    }
});



/** 학생이 1개 강좌의 '입실' 버튼 누름 */
router.post("/student/:sID/entry/:cID", async (req, res, next) => {
    try {
        const { sID, cID } = req.params;

        const now = new Date().toISOString(); // 현재 시간 가져오기 (ISO 형식)
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);

        // 1. 오늘 날짜 기준으로 기존 AttendanceLog 존재 여부 확인
        const existingAttendanceLog = await AttendanceLog.findAll({
            attributes: ['courseID', 'entryStatus'],
            where: {
                userID: sID,
                courseID : cID,
                entryTime: { [Op.between]: [todayStart, todayEnd] },
            },
        });
        if (existingAttendanceLog.length > 0) {
            return res.status(404).json({ success: false, message: "금일 해당 강좌의 입실은 이미 완료되었습니다." });
        }  

        // 2. 입실 INSERT
        const newAttendance = {
            userID : sID,
            courseID : cID,
            entryTime : now,
            entryStatus : true,
            exitStatus : false,
        };
        const result = await AttendanceLog.create(newAttendance);


        const sNm = await getUserNm(sID);
        const cNm = await getCourseNm(cID);
        if (result) {
            res.status(201).json({ success: true,  message: `${sNm} 학생 - ${cNm} 입실 성공`});
        } else {
            res.status(400).json({ success: false, message: `${sNm} 학생 - ${cNm} 입실 실패` });
        }
    } catch (error) {
        console.log(error);
        next(error, req, res);
    }
});


/** 학생이 1개 강좌의 '퇴실' 버튼 누름 */
router.put("/student/:sID/exit/:cID", async (req, res, next) => {
    try {
        const { sID, cID } = req.params;

        const now = new Date().toISOString(); // 현재 시간 가져오기 (ISO 형식)
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);
        
        // 1. 오늘 날짜 기준으로 기존 AttendanceLog 존재 여부 확인
        const attendanceLog = await AttendanceLog.findOne({
            attributes: ['courseID', 'entryStatus', 'exitStatus'],
            where: {
                userID: sID,
                courseID : cID,
                entryTime: { [Op.between]: [todayStart, todayEnd] },
            },
        });
        // console.log(attendanceLog);
        if (!attendanceLog) {
            return res.status(404).json({ success: false, message: "금일 해당 강좌의 입실 내역이 없습니다." });
        } else if (attendanceLog && (attendanceLog.dataValues.entryStatus && attendanceLog.dataValues.exitStatus)) {
            return res.status(404).json({ success: false, message: "금일 해당 강좌의 입퇴실이 이미 완료되었습니다." });
        }

        const exitStatus = {
            exitTime : now,
            exitStatus : true
        };
        
        const result = AttendanceLog.update(exitStatus, { where: { userID : sID, courseID : cID} });


        const sNm = await getUserNm(sID);
        const cNm = await getCourseNm(cID);
        if (result) {
            res.status(201).json({ success: true, message: `${sNm} 학생 - ${cNm} 퇴실 성공` });
        } else {
            res.status(400).json({ success: false, message: `${sNm} 학생 - ${cNm} 퇴실 실패` });
        }
        

    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            next(error);
        }
    }
});


/** [출석체크 메뉴] 선생님 - 속한 강좌 목록 */
router.get("/teacher/:tID/courses", async (req, res, next) => {
    const { tID } = req.params;
    const tNm = await getUserNm(tID);

    try {
        // 1. 선생님이 강의 중인 강좌 목록 조회
        const enrolledCourses = await Course.findAll({
            attributes: ["id","cmDtCd","courseName","userID","startDate","endDate"],
            where: { userID : tID },
            order: [['courseName', 'ASC']], // 선생님이 속한 강좌명 정렬 : 가나다 순 > 영어 알파벳 순
        });

        if (enrolledCourses.length > 0) {
            const cmmDtName = await getCmDtNm("CMCD01", enrolledCourses[0].cmDtCd);
            
            // 3. 데이터 재가공
            const teacherData = {
                userID: Number(tID),
                userName: tNm,
                courses: enrolledCourses.map(course => {

                    var isCourseDateToday = false;
                    const startDate = format(course.startDate, 'yyyy-MM-dd');
                    const endDate = format(course.endDate, 'yyyy-MM-dd');
        
                    if (todayYearMonthDay >= startDate
                        && todayYearMonthDay <= endDate) {
                        console.log("선생님 - 오늘 이 수업은 출석하는 날이에요");
                        isCourseDateToday = true;
                    };

                    return {
                        courseID: course.id,
                        courseName: course.courseName,
                        isCourseDateToday : isCourseDateToday,
                        startDate: startDate,
                        endDate: endDate,
                    };
                }),
            };
            res.status(200).json({ success: true, documents: teacherData, message: `${tNm} 선생님 - 담당 강좌 목록 조회 성공`});
        } else {
            const teacherData = {
                userID: Number(tID),
                userName: tNm,
                courses: []
            };
            res.status(200).json({ success: true, documents: teacherData, message: `${tNm} 선생님 - 담당 강좌 목록 없음`});
        }       
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            next(error);
        }
    }
});

/** 선생님 화면 - 출석체크 안한 학생 목록 조회 */
router.get("/teacher/:tID/unCheck/:cID", async (req, res, next) => {
    try {
        const { tID, cID } = req.params;

        // 오늘 날짜 설정
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);
        const cNm = await getCourseNm(cID);
        let tempProfileImage = "default.jpg";

        // 1-1. 특정 강좌를 듣는 모든 학생 조회
        const enrolledStudents = await Student.findAll({
            where: { courseID : cID },
            attributes: ['userID', 'courseID'], 
            include: {
                model: User, 
                attributes: ['userName','mobile', 'profileImage'], 
                where: { authCd : 'AUTH02' },
            },
            order: [[User, 'userName', 'ASC']] // 선생님 미입실 학생명 정렬 : 가나다 순
        });

        enrolledStudents.map((student) => {
            if (student.User.profileImage == null) {
                student.User.profileImage = tempProfileImage ;
            }
        })
       
        // console.log("enrolledStudents.length ===========> ", enrolledStudents.length);
        // 1-2. 특정 강좌를 듣는 학생이 1명이라도 있다면,
        if (enrolledStudents.length > 0) {
            // 1-3. 특정 강좌에서 오늘 '입실' 버튼을 누른 학생 조회
            const checkedInStudents = await AttendanceLog.findAll({
                where: {
                    courseID: cID, 

                    entryTime: { [Op.between]: [todayStart, todayEnd] }, 
                },
                attributes: ['userID'], 
            });

            // 1-4. 1-1에서 1-3을 빼기 = 미입실 학생만 남김
            const checkedInUserIDs = new Set(checkedInStudents.map(log => log.userID)); // 입실한 학생의 userID
            const uncheckedStudents = enrolledStudents.filter(student => 
                !checkedInUserIDs.has(student.userID) // 입실하지 않은 학생만 남김
            );
            // console.log("checkedInUserIDs  ===========> ", checkedInUserIDs)
            // 1-5. 결과 데이터 재가공
            const result = uncheckedStudents.map(student => ({
                courseID: student.courseID,
                userID: student.userID,
                userName: student.User.userName,
                profileImage: student.User.profileImage,
                mobile: formatPhoneNumber(student.User.mobile),
            }));
            // console.log("result ===========> ", result)
            
            if (result.length > 0) {
                res.status(200).json({ success: true, documents: result, message: `${cNm} 강좌 - 입실 미신청 학생 목록 조회 성공` });
            } else {
                res.status(200).json({ success: true, documents: [], message: `금일 전원 출석 완료` });
            }
        } else {
            res.status(200).json({ success: true, documents: [], message: `등록된 수강생 없음` });
        }
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            next(error);
        }
    }
});



/** 선생님이 1개 강좌의 1명 학생의 '수동출석' 버튼 누름 */
router.post("/teacher/:tID/force/:sID/course/:cID", async (req, res, next) => {
    try {
        const { tID, cID, sID } = req.params;
        const now = new Date().toISOString(); // 현재 시간 가져오기 (ISO 형식)

        const newAttendance = {
            userID : sID,
            courseID : cID,
            entryTime : now,
            entryStatus : true,
            exitStatus : false,
        };

        const result = await AttendanceLog.create(newAttendance);

        const tNm = await getUserNm(tID);
        const sNm = await getUserNm(sID);
        if (result) {
            res.status(201).json({ success: true,  message: `${tNm} 선생님 - ${sNm} 수동 출석 성공` });
        } else {
            res.status(400).json({ success: false, message: `${tNm} 선생님 - ${sNm} 수동 출석 실패` });
        }
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            next(error);
        }
    }
});

module.exports = router;
