"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
// Define Order Schema
const orderSchema = new mongoose_1.Schema({
    customerDetails: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        guests: { type: Number, required: true },
    },
    orderStatus: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    bills: {
        total: { type: Number, required: true },
        tax: { type: Number, required: true },
        totalWithTax: { type: Number, required: true },
    },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ], // Define as an array of objects
    table: { type: mongoose_1.Schema.Types.ObjectId, ref: "Table" },
    paymentMethod: { type: String },
    paymentData: {
        razorpay_order_id: { type: String },
        razorpay_payment_id: { type: String },
    },
}, { timestamps: true });
// Export Order Model
module.exports = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=orderModel.js.map