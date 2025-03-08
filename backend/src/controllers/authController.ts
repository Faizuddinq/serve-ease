const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAccessToken, setTokenCookie } = require("../utils/tokenSender");
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../src/types/customType"; // Import extended Request type

// **Register New User**
const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (!name || !phone || !email || !password || !role) {
      return next(createHttpError(400, "All fields are required!"));
    }

    // Check if user already exists
    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
      return next(createHttpError(400, "User with this email already exists!"));
    }

    // ✅ Hash password correctly before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save new user
    const user = new User({ name, phone, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: { id: user._id, name: user.name, email: user.email, role: user.role, password:hashedPassword },
    });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    next(createHttpError(500, "An error occurred while registering the user!"));
  }
};

// **User Login**
const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createHttpError(400, "All fields are required!"));
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.error("❌ Login failed: No user found with email:", email);
      return next(createHttpError(401, "Invalid email or password!"));
    }

    // ✅ Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
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
  } catch (error) {
    console.error("❌ Error during login:", error);
    next(createHttpError(500, "An error occurred during login!"));
  }
};

// **Get User Data**
const getUserData = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(createHttpError(401, "Unauthorized: No user found in request!"));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(createHttpError(404, "User not found!"));
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("❌ Error while fetching user data:", error);
    next(createHttpError(500, "An error occurred while fetching user data!"));
  }
};

// **User Logout**
const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json({ success: true, message: "User logged out successfully!" });
  } catch (error) {
    console.error("❌ Error during logout:", error);
    next(createHttpError(500, "An error occurred while logging out!"));
  }
};

export { register, login, getUserData, logout };
