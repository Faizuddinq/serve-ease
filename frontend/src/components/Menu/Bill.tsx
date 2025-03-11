import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store";
import { addOrder, createOrderStripe, updateTable } from "../../axios";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../Invoice/Invoice";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Order, OrderResponse, TableResponse, PaymentRequest } from "../../types/apiTypes";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

const Bill: React.FC = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const customerData = useSelector((state: RootState) => state.customer);
  const cartData = useSelector((state: RootState) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Online" | null>(null);
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", { variant: "warning" });
      return;
    }

    setLoading(true);

    try {
      let paymentData = {};

      if (paymentMethod === "Online") {
        if (!stripe || !elements) {
          enqueueSnackbar("Stripe is not loaded. Please try again!", { variant: "warning" });
          setLoading(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          enqueueSnackbar("Payment method is missing. Please try again.", { variant: "error" });
          setLoading(false);
          return;
        }

        // Create Stripe PaymentIntent
        const paymentRequest: PaymentRequest = {
          amount: Math.round(totalPriceWithTax * 100), // Convert to cents
          currency: "INR",
          email: customerData.customerPhone, // Using phone for email as per schema
        };

        const { data } = await createOrderStripe(paymentRequest);
        const clientSecret = data.order.client_secret;

        // Confirm Payment
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerData.customerName,
              email: customerData.customerPhone,
            },
          },
        });

        if (paymentResult.error) {
          enqueueSnackbar(paymentResult.error.message, { variant: "error" });
          setLoading(false);
          return;
        }

        enqueueSnackbar("Payment successful!", { variant: "success" });

        paymentData = {
          stripe_payment_intent_id: paymentResult.paymentIntent?.id,
        };
      }

      // Prepare Order Data
      const orderData: Order = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        orderDate: new Date().toISOString(),
        bills: {
          total,
          tax,
          totalWithTax,
        },
        items: cartData,
        table: customerData.table?.tableId,
        paymentMethod,
        paymentData,
      };

      orderMutation.mutate(orderData);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Order placement failed. Please try again!", { variant: "error" });
      setLoading(false);
    }
  };

  const orderMutation = useMutation<OrderResponse, Error, Order>({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData;
      setOrderInfo(data[0]);

      // Update Table
      const tableData = {
        status: "Booked",
        orderId: data[0]._id,
        tableId: data[0].table as string,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", { variant: "success" });
      setShowInvoice(true);
      setLoading(false);
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar("Order placement failed!", { variant: "error" });
      setLoading(false);
    },
  });

  const tableUpdateMutation = useMutation<TableResponse, Error, { status: string; orderId: string; tableId: string }>({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-gray-500 font-medium mt-2">Items ({cartData.length})</p>
        <h1 className="text-white text-md font-bold">₹{total.toFixed(2)}</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-gray-500 font-medium mt-2">Tax (5.25%)</p>
        <h1 className="text-white text-md font-bold">₹{tax.toFixed(2)}</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-gray-500 font-medium mt-2">Total With Tax</p>
        <h1 className="text-white text-md font-bold">₹{totalPriceWithTax.toFixed(2)}</h1>
      </div>

      {/* Stripe Card Input */}
      {paymentMethod === "Online" && (
        <div className="px-5 mt-4">
          <CardElement />
        </div>
      )}

      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`bg-gray-900 px-4 py-3 w-full rounded-lg text-gray-400 font-semibold ${
            paymentMethod === "Cash" ? "bg-gray-700" : ""
          }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`bg-gray-900 px-4 py-3 w-full rounded-lg text-gray-400 font-semibold ${
            paymentMethod === "Online" ? "bg-gray-700" : ""
          }`}
        >
          Online
        </button>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="bg-yellow-500 px-4 py-3 w-full rounded-lg text-gray-900 font-semibold text-lg mt-4"
        disabled={loading}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>

      {showInvoice && orderInfo && <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />}
    </>
  );
};

export default Bill;
