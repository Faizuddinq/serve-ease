const mongoose = require("mongoose");
import { Schema, model, Document, Types } from "mongoose";

// Define Table Interface
export interface ITable extends Document {
  tableNo: number;
  status: string;
  seats: number;
  currentOrder?: Types.ObjectId; // Optional because the table may not always have an order
}

// Define Table Schema
const tableSchema = new Schema<ITable>(
  {
    tableNo: { type: Number, required: true, unique: true },
    status: { type: String, default: "Available" },
    seats: { type: Number, required: true },
    currentOrder: { type: Schema.Types.ObjectId, ref: "Order" }, // Reference to Order model
  },
  { timestamps: true }
);

// Export Table Model
module.exports = model<ITable>("Table", tableSchema);
