"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isVerifiedUser } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/", isVerifiedUser, addOrder);
router.get("/", isVerifiedUser, getOrders);
router.get("/:id", isVerifiedUser, getOrderById);
router.put("/:id", isVerifiedUser, updateOrder);
router.delete("/:id", isVerifiedUser, deleteOrder);
module.exports = router;
//# sourceMappingURL=orderRoute.js.map