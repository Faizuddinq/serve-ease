import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import Invoice from "../Invoice/Invoice";
import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  verifyPaymentRazorpay,
} from "../../axios";
import { Order, PaymentRequest, Table } from "../../types/apiTypes";

const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Bill: React.FC = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state: RootState) => state.customer);
  const cartData = useSelector((state: RootState) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState<Order | null>(null);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", { variant: "warning" });
      return;
    }

    if (paymentMethod === "Online") {
      try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
          enqueueSnackbar("Razorpay SDK failed to load. Are you online?", { variant: "warning" });
          return;
        }

        const paymentData: PaymentRequest = { amount: totalPriceWithTax, currency: "INR", email: "" };
        const { data } = await createOrderRazorpay(paymentData);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
          amount: data.data[0].amount,
          currency: data.data[0].currency,
          name: "SERVE-EASE",
          description: "Secure Payment for Your Meal",
          order_id: data.data[0].orderId,
          handler: async (response: any) => {
            const verification = await verifyPaymentRazorpay({ paymentIntentId: response.razorpay_payment_id });
            enqueueSnackbar(verification.data.message, { variant: "success" });

            const orderData: Partial<Order> = {
              customerDetails: {
                name: customerData.customerName,
                phone: customerData.customerPhone,
                guests: customerData.guests,
              },
              orderStatus: "In Progress",
              bills: {
                total,
                tax,
                totalWithTax: totalPriceWithTax,
              },
              items: cartData,
              table: customerData.table?.tableId,
              paymentMethod,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            orderMutation.mutate(orderData);
          },
          theme: { color: "#025cca" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        enqueueSnackbar("Payment Failed!", { variant: "error" });
      }
    } else {
      const orderData: Partial<Order> = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        bills: {
          total,
          tax,
          totalWithTax: totalPriceWithTax,
        },
        items: cartData,
        table: customerData.table as Table,
        paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      orderMutation.mutate(orderData);
    }
  };

  const orderMutation = useMutation({
    mutationFn: (reqData: Partial<Order>) => addOrder(reqData as Order),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);
      const tableData = { status: "Booked", orderId: data._id, tableId: data.table._id };
      tableUpdateMutation.mutate(tableData);
      enqueueSnackbar("Order Placed!", { variant: "success" });
      setShowInvoice(true);
    },
    onError: (error) => console.error(error),
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData: { tableId: string; status: string; orderId: string }) => updateTable(reqData.tableId, reqData),
    onSuccess: () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => console.error(error),
  });

  return (
    <>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Items({cartData.length})
        </p>
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
        <button onClick={() => setPaymentMethod("Cash")} className={`btn ${paymentMethod === "Cash" ? "active" : ""}`}>
          Cash
        </button>
        <button onClick={() => setPaymentMethod("Online")} className={`btn ${paymentMethod === "Online" ? "active" : ""}`}>
          Online
        </button>
      </div>

      <div className="flex items-center gap-3 px-5 mt-4">
        <button className="btn blue">Print Receipt</button>
        <button onClick={handlePlaceOrder} className="btn yellow">Place Order</button>
      </div>

      {showInvoice && <Invoice orderInfo={orderInfo!} setShowInvoice={setShowInvoice} />}
    </>
  );
};

export default Bill;
