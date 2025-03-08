const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isVerifiedUser } = require("../middlewares/authMiddleware");
import { Router } from "express";

const router: Router = express.Router();

router.post("/", isVerifiedUser, addOrder);
router.get("/", isVerifiedUser, getOrders);
router.get("/:id", isVerifiedUser, getOrderById);
router.put("/:id", isVerifiedUser, updateOrder);
router.delete("/:id", isVerifiedUser, deleteOrder);

module.exports = router;