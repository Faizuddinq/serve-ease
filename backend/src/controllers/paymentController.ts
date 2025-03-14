const Razorpay = require("razorpay");
const config = require("../config/config");
const crypto = require("crypto");
const Payment = require("../models/paymentModel");
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";


// ✅ Define Types for Incoming Requests
interface CreateOrderRequest extends Request {
  body: {
    amount: number;
  };
}

interface VerifyPaymentRequest extends Request {
  body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
}

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: config.razorpayKeyId,
  key_secret: config.razorpaySecretKey,
});

/**
 * ✅ Create an Order with Razorpay
 */
export const createOrder = async (req: CreateOrderRequest, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    console.log("📢 Creating Order with Amount:", amount);

    const options = {
      amount: amount * 100, // Convert to paisa (1 INR = 100 paisa)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay Order Created:", order);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("❌ Error Creating Order:", error);
    next(error);
  }
};

/**
 * ✅ Verify Razorpay Payment Signature
 */
export const verifyPayment = async (req: VerifyPaymentRequest, res: Response, next: NextFunction) => {
  try {
    console.log("🔍 Verifying Payment:", req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", config.razorpaySecretKey)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment Verified Successfully!");
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      console.error("❌ Payment Verification Failed!");
      return next(createHttpError(400, "Payment verification failed!"));
    }
  } catch (error) {
    console.error("❌ Error Verifying Payment:", error);
    next(error);
  }
};

/**
 * ✅ Handle Razorpay Webhook Verification
 */
export const webHookVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("📢 Webhook Received:", req.body);

    const secret = config.razorpyWebhookSecret;
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      console.error("❌ Missing Webhook Signature!");
      return next(createHttpError(400, "Missing Razorpay webhook signature"));
    }

    const body = JSON.stringify(req.body);

    // 🛑 Verify Signature
    const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (expectedSignature === signature) {
      console.log("✅ Webhook Verified Successfully!");

      if (req.body.event === "payment.captured") {
        const payment = req.body.payload.payment.entity;
        console.log(`💰 Payment Captured: ${payment.amount / 100} INR`);

        // ✅ Save Payment to Database
        const newPayment = new Payment({
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
          createdAt: new Date(payment.created_at * 1000),
        });

        await newPayment.save();
        console.log("✅ Payment Saved in Database");
      }

      res.json({ success: true });
    } else {
      console.error("❌ Invalid Webhook Signature!");
      return next(createHttpError(400, "Invalid Razorpay webhook signature"));
    }
  } catch (error) {
    console.error("❌ Error Processing Webhook:", error);
    next(error);
  }
};
