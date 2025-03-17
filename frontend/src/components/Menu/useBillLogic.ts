import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import { addOrder, createOrderRazorpay, updateTable, verifyPaymentRazorpay } from "../../axios";
import { RootState } from "../../redux/store";
import {
  Order,
  OrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  Table,
  TableResponse,
} from "../../types/apiTypes"; // Importing API types

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// 🔹 Define Payment Methods
type PaymentMethod = "Cash" | "Online" | undefined;

const useBillLogic = () => {
  const dispatch = useDispatch();

  // ✅ Get customer & cart data from Redux
  const customerData = useSelector((state: RootState) => state.customer);
  const cartData = useSelector((state: RootState) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  // ✅ State management
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
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

        // 🔹 Prepare order data
        const reqData: CreateOrderRequest = { amount: totalPriceWithTax.toFixed(2) as unknown as number };
        const { data }: { data: CreateOrderResponse } = await createOrderRazorpay(reqData);

        const options = {
          key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "RESTRO",
          description: "Secure Payment for Your Meal",
          order_id: data.order.id,
          handler: async function (response: VerifyPaymentRequest) {
            const verification: { data: VerifyPaymentResponse } = await verifyPaymentRazorpay(response);
            enqueueSnackbar(verification.data.message, { variant: "success" });

            // ✅ Prepare full order data
            const orderData: Omit<Order, "_id" | "createdAt" | "updatedAt"> = {
              customerDetails: {
                name: customerData.customerName,
                phone: customerData.customerPhone,
                guests: customerData.guests,
              },
              orderStatus: "In Progress",
              bills: { total, tax, totalWithTax },
              items: cartData,
              table: customerData.table as Table,
              paymentMethod: paymentMethod,
              orderDate: new Date().toISOString(),
              paymentData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              },
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

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Payment Failed!", { variant: "error" });
      }
    } else {
      const orderData: Omit<Order, "_id" | "createdAt" | "updatedAt"> = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        bills: { total, tax, totalWithTax },
        items: cartData,
        table: customerData.table as Table,
        paymentMethod: paymentMethod,
        orderDate: new Date().toISOString(),
      };
      orderMutation.mutate(orderData);
    }
  };

  // ✅ Order Mutation
  const orderMutation = useMutation<OrderResponse, Error, Omit<Order, "_id" | "createdAt" | "updatedAt">>({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const newOrder = resData.data[0]; // Extract first order (assuming API returns an array)
      setOrderInfo(newOrder);

      const tableData = {
        status: "Booked",
        orderId: newOrder._id,
        tableId: newOrder.table._id,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", { variant: "success" });
      setShowInvoice(true);
    },
    onError: (error) => console.log(error),
  });

  // ✅ Table Update Mutation
  const tableUpdateMutation = useMutation<TableResponse, Error, { status: string; orderId: string; tableId: string }>({
    mutationFn: ({ tableId, ...data }) => updateTable(tableId, data),
    onSuccess: () => {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => console.log(error),
  });

  return {
    cartData,
    total,
    tax,
    totalPriceWithTax,
    paymentMethod,
    setPaymentMethod,
    handlePlaceOrder,
    showInvoice,
    setShowInvoice,
    orderInfo,
  };
};

export default useBillLogic