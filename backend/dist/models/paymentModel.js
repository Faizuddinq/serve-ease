"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
// Define Payment Schema
const paymentSchema = new mongoose_1.Schema({
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    method: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
// Export Payment Model
module.exports = (0, mongoose_1.model)("Payment", paymentSchema);
//# sourceMappingURL=paymentModel.js.map