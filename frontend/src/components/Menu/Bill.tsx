import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store"; // Assuming a typed store
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  verifyPaymentRazorpay,
} from "../../axios";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import Invoice from "../Invoice/Invoice";

// Load external script dynamically
function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Define Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  customerName: string;
  customerPhone: string;
  guests: number;
  table: {
    tableId: string;
  };
}

interface OrderData {
  customerDetails: {
    name: string;
    phone: string;
    guests: number;
  };
  orderStatus: string;
  bills: {
    total: number;
    tax: number;
    totalWithTax: number;
  };
  items: CartItem[];
  table: string;
  paymentMethod: string;
  paymentData?: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
}

interface RazorpayOrder {
  order: {
    id: string;
    amount: number;
    currency: string;
  };
}

const Bill: React.FC = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const customerData: Customer = useSelector((state: RootState) => state.customer);
  const cartData: CartItem[] = useSelector((state: RootState) => state.cart);
  const total: number = useSelector(getTotalPrice);

  const taxRate: number = 5.25;
  const tax: number = (total * taxRate) / 100;
  const totalPriceWithTax: number = total + tax;

  // Component State
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [orderInfo, setOrderInfo] = useState<OrderData | null>(null);

  // Order Mutation
  const orderMutation = useMutation({
    mutationFn: (reqData: OrderData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);

      // Update Table Status
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", { variant: "success" });
      setShowInvoice(true);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Table Update Mutation
  const tableUpdateMutation = useMutation({
    mutationFn: (reqData: { status: string; orderId: string; tableId: string }) => updateTable(reqData),
    onSuccess: () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Handle Order Placement
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", { variant: "warning" });
      return;
    }

    const orderData: OrderData = {
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

    if (paymentMethod === "Online") {
      try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
          enqueueSnackbar("Razorpay SDK failed to load. Are you online?", { variant: "warning" });
          return;
        }

        // Create Razorpay Order
        const reqData = { amount: totalPriceWithTax.toFixed(2) };
        const { data }: { data: RazorpayOrder } = await createOrderRazorpay(reqData);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "RESTRO",
          description: "Secure Payment for Your Meal",
          order_id: data.order.id,
          handler: async (response: RazorpayResponse) => {
            const verification = await verifyPaymentRazorpay(response);
            enqueueSnackbar(verification.data.message, { variant: "success" });

            orderData.paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            };

            setTimeout(() => {
              orderMutation.mutate(orderData);
            }, 1500);
          },
          prefill: {
            name: customerData.customerName,
            contact: customerData.customerPhone,
          },
          theme: { color: "#025cca" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Payment Failed!", { variant: "error" });
      }
    } else {
      orderMutation.mutate(orderData);
    }
  };

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
