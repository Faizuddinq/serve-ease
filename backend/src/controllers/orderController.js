"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const { default: mongoose } = require("mongoose");
// **Add Order**
const addOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = new Order(req.body);
        yield order.save();
        res.status(201).json({ success: true, message: "Order created!", data: order });
    }
    catch (error) {
        next(error);
    }
});
// **Get Order by ID**
const getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createHttpError(400, "Invalid order ID!"));
        }
        const order = yield Order.findById(id);
        if (!order) {
            return next(createHttpError(404, "Order not found!"));
        }
        res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
});
// **Get All Orders**
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order.find().populate("table");
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        next(error);
    }
});
// **Update Order**
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderStatus } = req.body;
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createHttpError(400, "Invalid order ID!"));
        }
        const order = yield Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
        if (!order) {
            return next(createHttpError(404, "Order not found!"));
        }
        res.status(200).json({ success: true, message: "Order updated!", data: order });
    }
    catch (error) {
        next(error);
    }
});
// **Delete Order**
const deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createHttpError(400, "Invalid order ID!"));
        }
        const order = yield Order.findByIdAndDelete(id);
        if (!order) {
            return next(createHttpError(404, "Order not found!"));
        }
        res.status(200).json({ success: true, message: "Order deleted successfully!" });
    }
    catch (error) {
        next(error);
    }
});
module.exports = { addOrder, getOrderById, getOrders, updateOrder, deleteOrder };
