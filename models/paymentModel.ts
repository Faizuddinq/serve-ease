const mongoose = require("mongoose");
import { Schema, model, Document } from "mongoose";

// Define Payment Interface
export interface IPayment extends Document {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  email: string;
  contact: string;
  createdAt?: Date;
}

// Define Payment Schema
const paymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    method: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Export Payment Model
module.exports = model<IPayment>("Payment", paymentSchema);
