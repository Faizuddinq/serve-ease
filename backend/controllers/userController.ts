const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAccessToken, setTokenCookie } = require("../utils/tokenSender");
import { Request, Response, NextFunction } from "express";

// Define Request Interfaces for Type Safety
interface RegisterRequest extends Request {
  body: {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// **Register New User**
const register = async (req: RegisterRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (!name || !phone || !email || !password || !role) {
      return next(createHttpError(400, "All fields are required!"));
    }

    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
      return next(createHttpError(400, "User already exists!"));
    }

    // Hash Password Before Storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, phone, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ success: true, message: "New user created!", data: user });
  } catch (error) {
    next(error);
  }
};

// **User Login**
// const login = async (req: LoginRequest, res: Response, next: NextFunction) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return next(createHttpError(400, "All fields are required!"));
//     }

//     const isUserPresent = await User.findOne({ email });
//     if (!isUserPresent) {
//       return next(createHttpError(401, "Invalid Credentials"));
//     }

//     const isMatch = await bcrypt.compare(password, isUserPresent.password);
//     if (!isMatch) {
//       return next(createHttpError(401, "Invalid Credentials"));
//     }

//     // Generate Token & Set Cookie
//     const accessToken = generateAccessToken(isUserPresent._id);
//     setTokenCookie(res, accessToken);

//     res.status(200).json({
//       success: true,
//       message: "User login successful!",
//       data: isUserPresent,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// **Get User Data**
// const getUserData = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return next(createHttpError(404, "User not found"));
//     }
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     next(error);
//   }
// };

// **User Logout**
// const logout = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     res.clearCookie("accessToken");
//     res.status(200).json({ success: true, message: "User logout successful!" });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = { register, 
    // login, getUserData, logout 
};
