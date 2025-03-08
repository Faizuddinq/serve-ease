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
const Table = require("../models/tableModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
// **Add Table**
const addTable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableNo, seats } = req.body;
        if (!tableNo) {
            return next(createHttpError(400, "Please provide table No!"));
        }
        const isTablePresent = yield Table.findOne({ tableNo });
        if (isTablePresent) {
            return next(createHttpError(400, "Table already exists!"));
        }
        const newTable = new Table({ tableNo, seats });
        yield newTable.save();
        res.status(201).json({ success: true, message: "Table added!", data: newTable });
    }
    catch (error) {
        next(error);
    }
});
// **Get All Tables**
const getTables = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tables = yield Table.find().populate({
            path: "currentOrder",
            select: "customerDetails",
        });
        res.status(200).json({ success: true, data: tables });
    }
    catch (error) {
        next(error);
    }
});
// **Update Table**
const updateTable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, orderId } = req.body;
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createHttpError(404, "Invalid ID!"));
        }
        const table = yield Table.findByIdAndUpdate(id, { status, currentOrder: orderId }, { new: true });
        if (!table) {
            return next(createHttpError(404, "Table not found!"));
        }
        res.status(200).json({ success: true, message: "Table updated!", data: table });
    }
    catch (error) {
        next(error);
    }
});
// **Delete Table**
const deleteTable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createHttpError(400, "Invalid Table ID!"));
        }
        const table = yield Table.findByIdAndDelete(id);
        if (!table) {
            return next(createHttpError(404, "Table not found!"));
        }
        res.status(200).json({ success: true, message: "Table deleted successfully!" });
    }
    catch (error) {
        next(error);
    }
});
module.exports = { addTable, getTables, updateTable, deleteTable };
//# sourceMappingURL=tableController.js.map