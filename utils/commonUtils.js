const { User, Course, CommonCode, CommonDetailCode } = require('../models/index');
// const { format } = require('date-fns');

/**
 * 휴대폰 번호에 정규식 조건으로 하이픈(-)을 추가하는 함수.
 * @param {string} phoneNumber - 하이픈 없는 휴대폰 번호 문자열.
 * @returns {string} - 하이픈이 추가된 휴대폰 번호 문자열.
 */
function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(
        /^(010)(\d{3,4})(\d{4})$/,
        (_, p1, p2, p3) => `${p1}-${p2}-${p3}`
    );
};
// 사용 예시
// console.log(formatPhoneNumber("01011112222")); // 010-1111-2222
// console.log(formatPhoneNumber("0103334444"));  // 010-333-4444

/**
 * 공통코드, 상세코드로 상세코드명을 조회
 * @param {Number} cmCd - 공통코드
 * @param {Number} cmDtCd - 상세코드
 * @returns {string} - 상세코드명 반환
 */
const getCmDtNm = async (cmCd, cmDtCd) => {
    // console.log("cmCd :", cmCd, ", cmDtCd :", cmDtCd);
    const cmmInfo = await CommonDetailCode.findOne({
        attributes: [ 'cmDtCd','cmDtName' ],
        where: { cmCd, cmDtCd },
        include : {
            model: CommonCode ,
            attributes: ['cmCd', 'cmName'],
            where: { cmCd },
        },
    });
    return cmmInfo.cmDtName;
};

/**
 * 사용자 ID로 사용자 이름 조회
 * @param {Number} userID - 사용자ID
 * @returns {string} - 사용자 이름 반환
 */
const getUserNm = async (userID) => {
    const userInfo = await User.findOne({
        attributes: [ 'userID', 'userName' ],
        where: { userID },
    });
    return userInfo.userName;
};

/**
 * 강좌 ID로 강좌명 조회
 * @param {Number} courseID - 강좌 ID
 * @returns {string} - 강좌명 반환
 */
const getCourseNm = async (courseID) => {
    const courseInfo = await Course.findOne({
        attributes: [ 'id', 'courseName','courseDesc' ],
        where: { id : courseID },
    });
    return courseInfo.courseName;
};

module.exports = {
    formatPhoneNumber,
    getCmDtNm,
    getUserNm,
    getCourseNm,
  };
  