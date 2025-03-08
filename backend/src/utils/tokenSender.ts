const jwt = require("jsonwebtoken");
const appConfig = require("../config/config");

// Generate Access Token
const generateAccessToken = (userId: string): string => {
  return jwt.sign({ _id: userId }, appConfig.accessTokenSecret, {
    expiresIn: "1d",
  });
};

// Set Cookie with Token
const setTokenCookie = (res: any, token: string) => {
  res.cookie("accessToken", token, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};

module.exports = { generateAccessToken, setTokenCookie };
