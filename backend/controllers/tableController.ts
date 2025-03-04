const Table = require("../models/Table.model");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
import { Request, Response, NextFunction } from "express";

// Define Request Interfaces for Type Safety
interface TableRequest {
  tableNo: number;
  seats: number;
}

interface UpdateTableRequest {
  status?: string;
  orderId?: string;
}

// **Add Table**
const addTable = async (req: Request<{}, {}, TableRequest>, res: Response, next: NextFunction) => {
  try {
    const { tableNo, seats } = req.body;

    if (!tableNo) {
      return next(createHttpError(400, "Please provide table No!"));
    }

    const isTablePresent = await Table.findOne({ tableNo });
    if (isTablePresent) {
      return next(createHttpError(400, "Table already exists!"));
    }

    const newTable = new Table({ tableNo, seats });
    await newTable.save();

    res.status(201).json({ success: true, message: "Table added!", data: newTable });
  } catch (error) {
    next(error);
  }
};

// **Get All Tables**
const getTables = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tables = await Table.find().populate({
      path: "currentOrder",
      select: "customerDetails",
    });

    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    next(error);
  }
};

// **Update Table**
const updateTable = async (
  req: Request<{ id: string }, {}, UpdateTableRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, orderId } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid ID!"));
    }

    const table = await Table.findByIdAndUpdate(
      id,
      { status, currentOrder: orderId },
      { new: true }
    );

    if (!table) {
      return next(createHttpError(404, "Table not found!"));
    }

    res.status(200).json({ success: true, message: "Table updated!", data: table });
  } catch (error) {
    next(error);
  }
};

// **Delete Table**
const deleteTable = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid Table ID!"));
    }

    const table = await Table.findByIdAndDelete(id);

    if (!table) {
      return next(createHttpError(404, "Table not found!"));
    }

    res.status(200).json({ success: true, message: "Table deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addTable, getTables, updateTable, deleteTable };
