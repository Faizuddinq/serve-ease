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
exports.logout = exports.getUserData = exports.login = exports.register = void 0;
const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAccessToken, setTokenCookie } = require("../utils/tokenSender");
// **Register New User**
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, email, password, role } = req.body;
        if (!name || !phone || !email || !password || !role) {
            return next(createHttpError(400, "All fields are required!"));
        }
        // Check if user already exists
        const isUserPresent = yield User.findOne({ email });
        if (isUserPresent) {
            return next(createHttpError(400, "User with this email already exists!"));
        }
        // ✅ Hash password correctly before storing
        const saltRounds = 10;
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        // Create and save new user
        const user = new User({ name, phone, email, password: hashedPassword, role });
        yield user.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: { id: user._id, name: user.name, email: user.email, role: user.role, password: hashedPassword },
        });
    }
    catch (error) {
        console.error("❌ Error during registration:", error);
        next(createHttpError(500, "An error occurred while registering the user!"));
    }
});
exports.register = register;
// **User Login**
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(createHttpError(400, "All fields are required!"));
        }
        // Find user by email
        const user = yield User.findOne({ email });
        if (!user) {
            console.error("❌ Login failed: No user found with email:", email);
            return next(createHttpError(401, "Invalid email or password!"));
        }
        // ✅ Compare entered password with stored hashed password
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ Password mismatch:", {
                enteredPassword: password,
                storedHashedPassword: user.password,
            });
            return next(createHttpError(401, "Invalid email or password!"));
        }
        // Generate JWT Token & Set Cookie
        const accessToken = generateAccessToken(user._id);
        setTokenCookie(res, accessToken);
        res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            data: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (error) {
        console.error("❌ Error during login:", error);
        next(createHttpError(500, "An error occurred during login!"));
    }
});
exports.login = login;
// **Get User Data**
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(createHttpError(401, "Unauthorized: No user found in request!"));
        }
        const user = yield User.findById(req.user._id);
        if (!user) {
            return next(createHttpError(404, "User not found!"));
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        console.error("❌ Error while fetching user data:", error);
        next(createHttpError(500, "An error occurred while fetching user data!"));
    }
});
exports.getUserData = getUserData;
// **User Logout**
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accessToken");
        res.status(200).json({ success: true, message: "User logged out successfully!" });
    }
    catch (error) {
        console.error("❌ Error during logout:", error);
        next(createHttpError(500, "An error occurred while logging out!"));
    }
});
exports.logout = logout;
//# sourceMappingURL=authController.js.map