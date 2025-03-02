const mongoose = require("mongoose");
import { Schema, model, Document, Types } from "mongoose";

// Define an Interface for Order Document
export interface IOrder extends Document {
  customerDetails: {
    name: string;
    phone: string;
    guests: number;
  };
  orderStatus: string;
  orderDate: Date;
  bills: {
    total: number;
    tax: number;
    totalWithTax: number;
  };
  items: any[]; // Replace 'any' with actual item structure if known
  table?: Types.ObjectId; // Use 'Types.ObjectId' instead of 'mongoose.Schema.Types.ObjectId'
  paymentMethod?: string;
  paymentData?: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Define Order Schema
const orderSchema = new Schema<IOrder>(
  {
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
    items: { type: Array, default: [] },
    table: { type: Schema.Types.ObjectId, ref: "Table" },
    paymentMethod: { type: String },
    paymentData: {
      razorpay_order_id: { type: String },
      razorpay_payment_id: { type: String },
    },
  },
  { timestamps: true }
);

// Export Order Model
module.exports = model<IOrder>("Order", orderSchema);
