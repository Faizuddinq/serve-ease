import { Request } from "express";
import { IUser } from "../models/userModel"; // Import User Type

// Extend Express Request Type
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser; // Attach user object to Request
  }
}
