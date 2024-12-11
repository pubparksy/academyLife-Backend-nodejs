const jwt = require("jsonwebtoken");
const { Model } = require("sequelize");
const secret = process.env.JWT_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret,
    { expiresIn: "14d" }
  );
};

module.exports = {
  generateAccessToken,
};
