"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
// Define Table Schema
const tableSchema = new mongoose_1.Schema({
    tableNo: { type: Number, required: true, unique: true },
    status: { type: String, default: "Available" },
    seats: { type: Number, required: true },
    currentOrder: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order" }, // Reference to Order model
}, { timestamps: true });
// Export Table Model
module.exports = (0, mongoose_1.model)("Table", tableSchema);
//# sourceMappingURL=tableModel.js.map