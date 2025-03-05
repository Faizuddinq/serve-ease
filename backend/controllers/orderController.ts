const createHttpError = require("http-errors");
const Order = require("../models/Order.model");
const mongoose = require("mongoose");
import { Request, Response, NextFunction } from "express";

// Define Request Interfaces for Type Safety
interface OrderRequest {
  customerDetails: {
    name: string;
    phone: string;
    guests: number;
  };
  orderStatus: string;
  bills: {
    total: number;
    tax: number;
    totalWithTax: number;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  table?: string;
  paymentMethod?: string;
  paymentData?: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
  };
}

// **Add Order**
const addOrder = async (req: Request<{}, {}, OrderRequest>, res: Response, next: NextFunction) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

// **Get Order by ID**
const getOrderById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid order ID!"));
    }

    const order = await Order.findById(id);
    if (!order) {
      return next(createHttpError(404, "Order not found!"));
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// **Get All Orders**
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find().populate("table");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// **Update Order**


// **Delete Order**


module.exports = { addOrder, getOrderById, getOrders };
