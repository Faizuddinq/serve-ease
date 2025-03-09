import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
const config = require("../config/config");
const Payment = require("../models/paymentModel");

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: "2025-02-24.acacia", // Use the latest Stripe API version
});

// ✅ Create PaymentIntent (Equivalent to Razorpay Order)
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Convert amount to the smallest currency unit
      currency: "INR",
      metadata: { receipt: `receipt_${Date.now()}` },
    };

    const order = await stripe.paymentIntents.create(options);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    next(error);
  }
};

// ✅ Verify Payment (Checking Payment Status)
const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId } = req.body; // Get payment ID from the request

    // Retrieve PaymentIntent details from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    if (paymentIntent.status === "succeeded") {
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    next(error);
  }
};

// ✅ Handle Webhooks (Secure Payment Verification)
const webHookVerification = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = config.stripeWebhookSecret;

  let event: Stripe.Event;

  try {
    // 🛑 Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("✅ Webhook Verified:", event.type);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 Payment Captured: ${paymentIntent.amount / 100} ${paymentIntent.currency}`);

      // ✅ Extract Payment Details
      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method as string);

      // ✅ Add Payment Details in Database (Matching Razorpay Structure)
      const newPayment = new Payment({
        paymentId: paymentIntent.id,
        orderId: paymentIntent.metadata.receipt, // Since Stripe doesn’t have 'order_id', we use the receipt ID
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        method: charge.payment_method_details.type, // Extract method (e.g., card, UPI)
        email: charge.billing_details.email || "",
        contact: charge.billing_details.phone || "",
        createdAt: new Date(paymentIntent.created * 1000), // Convert timestamp to Date
      });

      await newPayment.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

module.exports = { createOrder, verifyPayment, webHookVerification };