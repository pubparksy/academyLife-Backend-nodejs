const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const { generateAccessToken } = require("../utils/token");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../models");
const upload = require("../routers/uploadImage");

const signup = async (req, res, next) => {
  const { email, password, userName, nickname, mobile, registerRef } = req.body;
  let authCd = "AUTH02";

  try {
    // 중복되는 이메일 검증
    const existingUser = await userService.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "중복 제약 위배" });
    }

    // 여기서부터 정상 처리
    const hashedPassword = await bcrypt.hash(password, 10);

    // 선생님일 경우 auchCd 변경
    if (req.path == "/signup/teacher") {
      authCd = "AUTH01";
    }

    const user = await userService.createUser({
      email,
      password: hashedPassword,
      userName,
      nickname,
      mobile,
      authCd,
      registerRef,
    });
    res.status(201).json({ user: user });
  } catch (error) {
    // 기타 에러 발생 시 errorHandler로 넘기기
    next(error, req, res);
  }
};

const login = async (req, res, next) => {
  const { email, password, deviceToken } = req.body;

  try {
    // 가입된 이메일인지 검증
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "이메일이나 패스워드가 일치하지 않아요" });
    }

    // 이메일과 비밀번호가 일치하는 회원이 있는지 검증
    const matchingPassword = await bcrypt.compare(password, user.password);
    if (!matchingPassword) {
      return res.status(400).json({ message: "이메일이나 패스워드가 일치하지 않아요" });
    }

    // 맞을 시 토큰 생성하기
    const token = generateAccessToken(user);

    // 디바이스 토큰이 있다면 저장하기
    if (deviceToken != null) {
      let userID = user.userID;
      await userService.updateDeviceToken(userID, deviceToken);
    }

    res.json({
      token,
      user: user,
    });
    // 기타 에러 발생 시 errorHandler로 넘기기
  } catch (error) {
    next(error, req, res);
  }
};

const findUserByID = async (req, res, next) => {
  const userID = req.params.userID;

  try {
    const user = await userService.findUserByID(userID);
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    next(error, req, res);
  }
};

const updatePassword = async (req, res, next) => {
  const userID = req.params.userID;
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const _ = await userService.updateUser({ password: hashedPassword }, userID);
    res.status(201).send({ success: true });
  } catch (error) {
    next(error, req, res);
  }
};

const updateUser = async (req, res, next) => {
  const userID = req.params.userID;
  const { userName, nickname, mobile } = req.body;

  try {
    const _ = await userService.updateUser(
      {
        userName: userName,
        nickname: nickname,
        mobile: mobile,
      },
      userID
    );
    res.status(201).send({ success: true });
  } catch (error) {
    next(error, req, res);
  }
};

const socialLogin = async (req, res, next) => {
  const { loginMethod, socialID, deviceToken } = req.body;

  try {
    // 로그인 방식과 일치하는 컬럼에 해당 socialID가 존재하는 회원이 있는지 검사하기
    const user = await userService.checkForExistingAccount(loginMethod, socialID);

    // 회원이 있을 시 토큰 생성하기
    const token = generateAccessToken(user);

    // 디바이스 토큰이 있다면 저장하기
    if (deviceToken != null) {
      let userID = user.userID;
      await userService.updateDeviceToken(userID, deviceToken);
    }

    // 회원이 있다면 201과 회원 정보 및 소셜 인증 정보 반환하기
    res.status(201).json({
      token,
      user: user,
      loginMethod: loginMethod,
      socialID: socialID,
    });
  } catch (error) {
    // 회원이 없더라도 201, 소셜 인증 정보 반환하기: 회원가입 ViewModel에 넘겨주기 위함
    res.status(201).json({
      token: null,
      user: null,
      loginMethod: loginMethod,
      socialID: socialID,
    });
  }
};

const socialSignup = async (req, res, next) => {
  const { email, userName, nickname, mobile, loginMethod, socialID } = req.body;
  let authCd = "AUTH02";

  try {
    // 중복되는 이메일 검증
    const existingUser = await userService.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "중복 제약 위배" });
    }

    let user = {
      email,
      userName,
      nickname,
      mobile,
      authCd,
    };

    const userInfo = await userService.socialSignup(loginMethod, socialID, user);
    res.status(201).json({ user: userInfo });
  } catch (error) {
    // 기타 에러 발생 시 errorHandler로 넘기기
    next(error, req, res);
  }
};

const uploadProfileImage = async (req, res, next) => {
  const userID = req.params.userID;

  // SA에 파일 업로드: 소영님이 만드신 upload 기능 사용
  try {
    await new Promise((resolve, reject) => {
      upload.array("images")(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    const fileName = req.files[0].blobName;

    // 프로필 이미지 모드로 updateUser 서비스 실행
    const updateMode = "profileImage";
    await userService.updateUser({ profileImage: fileName }, userID, updateMode);
    res.status(201).send({ profileImage: fileName });
  } catch (error) {
    next(error, req, res);
  }
};

module.exports = {
  signup,
  login,
  findUserByID,
  updatePassword,
  updateUser,
  socialLogin,
  socialSignup,
  uploadProfileImage,
};
