import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice";
import { addOrder, createOrderStripe, updateTable } from "../../axios";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../voice/Invoice";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Order, OrderResponse, TableResponse, PaymentRequest } from "../../types"; // Importing provided interfaces

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

const Bill: React.FC = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const customerData = useSelector((state: any) => state.customer);
  const cartData = useSelector((state: any) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", { variant: "warning" });
      return;
    }

    if (paymentMethod === "Online") {
      if (!stripe || !elements) {
        enqueueSnackbar("Stripe is not loaded. Please try again!", { variant: "warning" });
        return;
      }

      try {
        // Create Stripe PaymentIntent
        const paymentRequest: PaymentRequest = {
          amount: totalPriceWithTax,
          currency: "INR",
          email: customerData.customerPhone, // Using phone for email as per schema
        };

        const { data } = await createOrderStripe(paymentRequest);
        const clientSecret = data.order.client_secret;

        // Confirm Payment
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("CardElement not found");

        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerData.customerName,
              email: customerData.customerPhone, // Using phone as email
            },
          },
        });

        if (paymentResult.error) {
          enqueueSnackbar(paymentResult.error.message, { variant: "error" });
          return;
        }

        enqueueSnackbar("Payment successful!", { variant: "success" });

        // Place the order
        const orderData: Order = {
          customerDetails: {
            name: customerData.customerName,
            phone: customerData.customerPhone,
            guests: customerData.guests,
          },
          orderStatus: "In Progress",
          orderDate: new Date().toISOString(),
          bills: {
            total: total,
            tax: tax,
            totalWithTax: totalPriceWithTax,
          },
          items: cartData,
          table: customerData.table.tableId,
          paymentMethod: paymentMethod,
          paymentData: {
            stripe_payment_intent_id: paymentResult.paymentIntent?.id,
          },
        };

        setTimeout(() => {
          orderMutation.mutate(orderData);
        }, 1500);
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Payment Failed!", { variant: "error" });
      }
    } else {
      // Place the order for Cash
      const orderData: Order = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        orderDate: new Date().toISOString(),
        bills: {
          total: total,
          tax: tax,
          totalWithTax: totalPriceWithTax,
        },
        items: cartData,
        table: customerData.table.tableId,
        paymentMethod: paymentMethod,
      };
      orderMutation.mutate(orderData);
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
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const tableUpdateMutation = useMutation<TableResponse, Error, { status: string; orderId: string; tableId: string }>({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      console.log(resData);
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
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

      {/* Stripe Card Input */}
      {paymentMethod === "Online" && (
        <div className="px-5 mt-4">
          <CardElement />
        </div>
      )}

      <div className="flex items-center gap-3 px-5 mt-4">
        <button onClick={() => setPaymentMethod("Cash")} className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === "Cash" ? "bg-[#383737]" : ""}`}>
          Cash
        </button>
        <button onClick={() => setPaymentMethod("Online")} className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === "Online" ? "bg-[#383737]" : ""}`}>
          Online
        </button>
      </div>

      <button onClick={handlePlaceOrder} className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg mt-4">
        Place Order
      </button>

      {showInvoice && orderInfo && <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />}
    </>
  );
};

export default Bill;
