import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import { addOrder, createOrderStripe, verifyPaymentStripe, updateTable } from "../../axios/index";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../Invoice/Invoice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// ✅ Load Stripe with your Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ totalAmount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const customerData = useSelector((state) => state.customer);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      // ✅ Create Payment Intent
      const { data } = await createOrderStripe({ amount: totalAmount, currency: "inr", email: customerData.customerPhone });

      // ✅ Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        enqueueSnackbar(result.error.message, { variant: "error" });
      } else if (result.paymentIntent.status === "succeeded") {
        enqueueSnackbar("Payment successful!", { variant: "success" });
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (error) {
      console.error("Payment error:", error);
      enqueueSnackbar("Payment failed!", { variant: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 bg-white text-black rounded-md" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md" disabled={!stripe}>
        Pay ₹{totalAmount.toFixed(2)}
      </button>
    </form>
  );
};

const Bill = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  // ✅ Order Mutation
  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);

      // ✅ Update Table Status
      const tableData = { status: "Booked", orderId: data._id, tableId: data.table };
      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", { variant: "success" });
      setShowInvoice(true);
    },
    onError: (error) => console.error(error),
  });

  // ✅ Table Update Mutation
  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => console.error(error),
  });

  // ✅ Handle Order Placement
  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", { variant: "warning" });
      return;
    }

    if (paymentMethod === "Online") {
      // ✅ Open Stripe Payment Form
      return;
    } else {
      // ✅ Place Order for Cash Payment
      const orderData = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        bills: {
          total,
          tax,
          totalWithTax,
        },
        items: cartData,
        table: customerData.table.tableId,
        paymentMethod,
      };
      orderMutation.mutate(orderData);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <>
        <div className="flex items-center justify-between px-5 mt-2">
          <p className="text-xs text-[#ababab] font-medium mt-2">Items({cartData.length})</p>
          <h1 className="text-[#f5f5f5] text-md font-bold">₹{total.toFixed(2)}</h1>
        </div>
        <div className="flex items-center justify-between px-5 mt-2">
          <p className="text-xs text-[#ababab] font-medium mt-2">Tax(5.25%)</p>
          <h1 className="text-[#f5f5f5] text-md font-bold">₹{tax.toFixed(2)}</h1>
        </div>
        <div className="flex items-center justify-between px-5 mt-2">
          <p className="text-xs text-[#ababab] font-medium mt-2">Total With Tax</p>
          <h1 className="text-[#f5f5f5] text-md font-bold">₹{totalPriceWithTax.toFixed(2)}</h1>
        </div>

        <div className="flex items-center gap-3 px-5 mt-4">
          <button onClick={() => setPaymentMethod("Cash")} className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === "Cash" ? "bg-[#383737]" : ""}`}>
            Cash
          </button>
          <button onClick={() => setPaymentMethod("Online")} className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === "Online" ? "bg-[#383737]" : ""}`}>
            Online
          </button>
        </div>

        {/* ✅ Show Stripe Checkout Form if Online Payment is Selected */}
        {paymentMethod === "Online" && <CheckoutForm totalAmount={totalPriceWithTax} onPaymentSuccess={handlePlaceOrder} />}

        <div className="flex items-center gap-3 px-5 mt-4">
          <button className="bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg">Print Receipt</button>
          <button onClick={handlePlaceOrder} className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg">
            Place Order
          </button>
        </div>

        {showInvoice && <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />}
      </>
    </Elements>
  );
};

export default Bill;
