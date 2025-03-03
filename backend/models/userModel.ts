const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
import { Schema, model, Document } from "mongoose";

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
      validate: {
        validator: function (v: string) {
          return /\S+@\S+\.\S+/.test(v);
        },
        message: "Email must be in valid format!",
      },
    },
    phone: {
      type: String, // Phone numbers may contain + or leading zeros
      required: true,
      validate: {
        validator: function (v: string) {
          return /^\d{10}$/.test(v);
        },
        message: "Phone number must be a 10-digit number!",
      },
    },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash Password Before Saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Entered Password with Hashed Password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export User Model
module.exports = model<IUser>("User", userSchema);
