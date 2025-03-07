"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcrypt");
// Define User Schema
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => /\S+@\S+\.\S+/.test(v),
            message: "Email must be in valid format!",
        },
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => /^\d{10}$/.test(v),
            message: "Phone number must be a 10-digit number!",
        },
    },
    password: { type: String, required: true }, // No hashing before saving
    role: { type: String, required: true },
}, { timestamps: true });
// Export User Model
module.exports = (0, mongoose_1.model)("User", userSchema);
