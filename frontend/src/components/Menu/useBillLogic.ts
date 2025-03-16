// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useMutation } from "@tanstack/react-query";
// import { enqueueSnackbar } from "notistack";
// import {
//   addOrder,
//   createOrderRazorpay,
//   updateTable,
//   verifyPaymentRazorpay,
// } from "../../axios";
// import { removeAllItems } from "../../redux/slices/cartSlice";
// import { removeCustomer } from "../../redux/slices/customerSlice";
// import { RootState } from "../../redux/store";
// import {
//   // CreateOrderRequest,
//   // CreateOrderResponse,
//   VerifyPaymentRequest,
//   // VerifyPaymentResponse,
//   Order,
//   OrderResponse,
// } from "../../types/apiTypes";
// // import { CartItem } from "../../redux/slices/cartSlice";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// export function loadScript(src: string): Promise<boolean> {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = src;
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// }

// export function useBillLogic() {
//   const dispatch = useDispatch();

//   const customerData = useSelector((state: RootState) => state.customer);
//   const cartData = useSelector((state: RootState) => state.cart);
//   const total = useSelector((state: RootState) =>
//     state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   );

//   const taxRate = 5.25;
//   const tax = (total * taxRate) / 100;
//   const totalPriceWithTax = total + tax;

//   const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
//   const [showInvoice, setShowInvoice] = useState<boolean>(false);
//   const [orderInfo, setOrderInfo] = useState<Order | null>(null);

//   const handlePlaceOrder = async () => {
//     if (!paymentMethod) {
//       enqueueSnackbar("Please select a payment method!", { variant: "warning" });
//       return;
//     }

//     if (paymentMethod === "Online") {
//       try {
//         const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

//         if (!res) {
//           enqueueSnackbar("Razorpay SDK failed to load. Are you online?", { variant: "warning" });
//           return;
//         }

//         const { data } = await createOrderRazorpay({ amount: Number(totalPriceWithTax.toFixed(2)) });

//         const razorpayOrder = data.order;

//         const options = {
//           key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
//           amount: razorpayOrder.amount,
//           currency: razorpayOrder.currency,
//           name: "RESTRO",
//           description: "Secure Payment for Your Meal",
//           order_id: razorpayOrder.id,
//           handler: async (response: VerifyPaymentRequest) => {
//             const verification = await verifyPaymentRazorpay(response);
//             enqueueSnackbar(verification.data.message, { variant: "success" });

//             const orderData = createOrderData(response);
//             orderMutation.mutate(orderData);
//           },
//           prefill: {
//             name: customerData.customerName,
//             contact: customerData.customerPhone,
//           },
//           theme: { color: "#025cca" },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } catch (error) {
//         enqueueSnackbar("Payment Failed!", { variant: "error" });
//       }
//     } else {
//       const orderData = createOrderData();
//       orderMutation.mutate(orderData);
//     }
//   };

//   const createOrderData = (paymentData: VerifyPaymentRequest | null = null): Order => ({
//     _id: "", // This will be set after order creation
//     customerDetails: {
//       name: customerData.customerName,
//       phone: customerData.customerPhone,
//       guests: customerData.guests,
//     },
//     orderStatus: "In Progress",
//     bills: {
//       total,
//       tax,
//       totalWithTax: totalPriceWithTax,
//     },
//     items: cartData,
//     table: customerData.table!,
//     paymentMethod: paymentMethod!,
//     orderDate: new Date().toISOString(),
//     createdAt: "",
//     updatedAt: "",
//   });

//   const orderMutation = useMutation({
//     mutationFn: (reqData: Order) => addOrder(reqData),
//     onSuccess: (resData) => {
//       const { data } = resData.data as { data: OrderResponse };
//       setOrderInfo(data);

//       const tableData = { status: "Booked", orderId: data._id, tableId: data.table._id };
//       tableUpdateMutation.mutate(tableData);

//       enqueueSnackbar("Order Placed!", { variant: "success" });
//       setShowInvoice(true);
//     },
//     onError: (error) => console.log(error),
//   });

//   const tableUpdateMutation = useMutation({
//     mutationFn: (reqData: { status: string; orderId: string; tableId: string }) => updateTable(reqData),
//     onSuccess: () => {
//       dispatch(removeCustomer());
//       dispatch(removeAllItems());
//     },
//     onError: (error) => console.log(error),
//   });

//   return {
//     total,
//     tax,
//     totalPriceWithTax,
//     paymentMethod,
//     setPaymentMethod,
//     handlePlaceOrder,
//     showInvoice,
//     setShowInvoice,
//     orderInfo,
//   };
// }
