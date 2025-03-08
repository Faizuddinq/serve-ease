import { Request } from "express";
import { Document } from "mongoose";

// Extend Express Request type with a `user` property
export interface AuthRequest extends Request {
  user?: Document & {
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
