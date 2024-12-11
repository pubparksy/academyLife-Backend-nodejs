const models = require("../models");

const createUser = async (data) => {
  return await models.User.create(data);
};

const findUserByEmail = async (email) => {
  return await models.User.findOne({
    where: { email },
  });
};

const findUserByID = async (userID) => {
  return await models.User.findOne({
    where: { userID },
  });
};

const updateUser = async (data, userID) => {
  return await models.User.update(data, {
    where: { userID },
  });
};

const checkForExistingAccount = async (loginMethod, userID) => {
  const columnName = loginMethod === "kakao" ? "kakao" : "apple";

  return await models.User.findOne({
    where: {
      [columnName]: userID,
    },
  });
};

const socialSignup = async (user) => {
  return await models.User.create(user);
};

const updateDeviceToken = async (userID, deviceToken) => {
  await models.User.update(
    { deviceToken },
    {
      where: { userID },
    }
  );
  return;
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
