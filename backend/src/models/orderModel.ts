import mongoose, { Document, Model, Schema } from "mongoose";

// ✅ Define Item Interface
interface IItem {
  name: string;
  price: number;
  quantity: number;
}

// ✅ Define Order Interface
interface IOrder extends Document {
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
  items: IItem[]; // ✅ Now properly typed!
  table: mongoose.Types.ObjectId; // Refers to the Table model
  paymentMethod?: string;
  paymentData?: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Define Mongoose Schema
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
    table: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    paymentMethod: { type: String },
    paymentData: {
      razorpay_order_id: { type: String },
      razorpay_payment_id: { type: String },
    },
  },
  { timestamps: true }
);

// ✅ Export Order Model
const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
