"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { register, login, getUserData, logout } = require("../controllers/authController");
const { isVerifiedUser } = require("../middlewares/authMiddleware");
const router = express.Router();
// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", isVerifiedUser, logout);
router.get("/", isVerifiedUser, getUserData);
module.exports = router;
