import mongoose, { Schema, Document, model } from "mongoose";
const bcrypt = require("bcrypt");

// Define User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

// Define User Schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /\S+@\S+\.\S+/.test(v),
        message: "Email must be in valid format!",
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => /^\d{10}$/.test(v),
        message: "Phone number must be a 10-digit number!",
      },
    },
    password: { type: String, required: true }, // No hashing before saving
    role: { type: String, required: true },
  },
  { timestamps: true }
);



// Export User Model
module.exports = model<IUser>("User", userSchema);
