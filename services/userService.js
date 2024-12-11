const userDao = require("../dao/userDao");
const { BlobServiceClient } = require("@azure/storage-blob");

const createUser = async (data) => {
  return await userDao.createUser(data);
};

const findUserByEmail = async (email) => {
  return await userDao.findUserByEmail(email);
};

const findUserByID = async (userID) => {
  return await userDao.findUserByID(userID);
};

const updateUser = async (newInfo, userID, updateMode) => {
  // 프로필 이미지 모드라면
  if (updateMode === "profileImage") {
    try {
      const user = await userDao.findUserByID(userID);
      const oldImage = user.dataValues.profileImage;

      // SA에서 기존 파일 지우기
      if (oldImage) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.SA_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient("academylife");
        const blobClient = containerClient.getBlobClient(oldImage);

        const deleteResult = await blobClient.deleteIfExists();
        if (!deleteResult) {
          console.warn(`${oldImage} 없음`);
        }
      }
    } catch (error) {
      console.log(oldImage, "제거 실패: ", error);
    }
  }

  return await userDao.updateUser(newInfo, userID);
};

const checkForExistingAccount = async (loginMethod, socialID) => {
  return await userDao.checkForExistingAccount(loginMethod, socialID);
};

const socialSignup = async (loginMethod, socialID, user) => {
  switch (loginMethod) {
    case "apple":
      user.apple = socialID;
      return await userDao.socialSignup(user);
    default:
      user.kakao = socialID;
      return await userDao.socialSignup(user);
  }
};

const updateDeviceToken = async (userID, deviceToken) => {
  return await userDao.updateDeviceToken(userID, deviceToken);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByID,
  updateUser,
  checkForExistingAccount,
  socialSignup,
  updateDeviceToken,
};
