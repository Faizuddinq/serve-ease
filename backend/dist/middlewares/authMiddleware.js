"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");
const isVerifiedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return next(createHttpError(401, "Please provide token!"));
        }
        // Verify Token
        const decodedToken = jwt.verify(accessToken, config.accessTokenSecret);
        // Find User in Database
        const user = yield User.findById(decodedToken._id);
        if (!user) {
            return next(createHttpError(401, "User does not exist!"));
        }
        // Attach User to Request Object
        req.user = user;
        next();
    }
    catch (error) {
        next(createHttpError(401, "Invalid Token!"));
    }
});
module.exports = { isVerifiedUser };
//# sourceMappingURL=authMiddleware.js.map