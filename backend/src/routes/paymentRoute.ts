const express = require("express");

const { isVerifiedUser } = require("../middlewares/authMiddleware");
const { createOrder, verifyPayment, webHookVerification } = require("../controllers/paymentController");

import { Router } from "express";
const router: Router = express.Router();
 
router.route("/create-order").post(isVerifiedUser , createOrder);
router.route("/verify-payment").post(isVerifiedUser , verifyPayment);
router.route("/webhook-verification").post(webHookVerification);


module.exports = router;