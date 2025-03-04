const Table = require("../models/tableModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
import { Request, Response, NextFunction } from "express";

// Define Request Interfaces for Type Safety
interface TableRequestBody {
  tableNo: number;
  seats: number;
}

interface UpdateTableRequestBody {
  status?: string;
  orderId?: string;
}

// **Add Table**
const addTable = async (req: Request<{}, {}, TableRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { tableNo, seats } = req.body;

    if (!tableNo) {
      return next(createHttpError(400, "Please provide Table Number!"));
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


// **Delete Table**


module.exports = { addTable, getTables,   };
