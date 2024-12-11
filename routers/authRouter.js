const express = require("express");
const { signup, login, findUserByID, updateUser, socialLogin, socialSignup, updatePassword, uploadProfileImage } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup); // 일반 회원가입
router.post("/signup/teacher", signup); // 선생님 회원가입
router.post("/login", login); // 티미 로그인
router.post("/login/social", socialLogin); // 소셜 로그인: 인증키로 회원이 존재하는지 검사 & 로그인 처리
router.post("/signup/social", socialSignup); // 소셜 회원가입
router.get("/:userID", findUserByID); // 회원 ID로 회원 정보 검사
router.patch("/password/:userID", updatePassword); // 회원 ID로 회원 비밀번호 수정
router.post("/profileImage/:userID", uploadProfileImage); // 회원 ID로 회원 프로필 이미지 등록
router.patch("/:userID", updateUser); // 회원 ID로 회원 정보 수정

module.exports = router;
