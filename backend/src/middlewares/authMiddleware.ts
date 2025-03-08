const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/customType";

const isVerifiedUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return next(createHttpError(401, "Please provide token!"));
    }

    // Verify Token
    const decodedToken = jwt.verify(accessToken, config.accessTokenSecret) as { _id: string };

    // Find User in Database
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return next(createHttpError(401, "User does not exist!"));
    }

    // Attach User to Request Object
    req.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, "Invalid Token!"));
  }
};


module.exports = { isVerifiedUser };
