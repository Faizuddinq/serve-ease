import { Schema, model, Document, Types } from "mongoose";

// Define Item Structure
interface IItem {
  name: string;
  price: number;
  quantity: number;
}

// Define Order Interface
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
  items: IItem[]; // Array of Item objects
  table?: Types.ObjectId; // Reference to Table
  paymentMethod?: string;
  paymentData?: {
    stripe_payment_intent_id?: string;
    stripe_charge_id?: string;
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
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    table: { type: Schema.Types.ObjectId, ref: "Table" },
    paymentMethod: { type: String },
    paymentData: {
      stripe_payment_intent_id: { type: String }, // Stores PaymentIntent ID
      stripe_charge_id: { type: String }, // Stores Charge ID
    },
  },
  { timestamps: true }
);

// Export Order Model
export default model<IOrder>("Order", orderSchema);
