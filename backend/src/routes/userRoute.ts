const express = require("express");
const { register, login, getUserData, logout } = require("../controllers/authController");
const { isVerifiedUser } = require("../middlewares/authMiddleware");
import { Router } from "express";

const router: Router = express.Router();

// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", isVerifiedUser, logout);
router.get("/", isVerifiedUser, getUserData);

module.exports = router;
