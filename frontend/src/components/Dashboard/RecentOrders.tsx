import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../axios";
import { formatDateAndTime } from "../../utils";
import { Order, OrderResponse } from "../../types/apiTypes";
import { AxiosError } from "axios";

const RecentOrders: React.FC = () => {
  const queryClient = useQueryClient();

  // ✅ Handle Order Status Change
  const handleStatusChange = (orderId: string, orderStatus: string) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  // ✅ Mutation for Updating Order Status
  const orderStatusUpdateMutation = useMutation({
    mutationFn: async ({ orderId, orderStatus }: { orderId: string; orderStatus: string }) => {
      const response = await updateOrderStatus(orderId, orderStatus);
      return response.data;
    },
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });

      // ✅ FIX: Ensure `invalidateQueries` is used correctly
      queryClient.invalidateQueries({ queryKey: ["orders"] }); 


    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || "Failed to update order status!";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  // ✅ Fetch Orders
  const { data: resData, isError } = useQuery<OrderResponse, AxiosError>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await getOrders();
      return response.data;
    },
    placeholderData: undefined,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {resData?.data.map((order: Order) => ( // ✅ FIX: Removed unused `index`
              <tr key={order._id} className="border-b border-gray-600 hover:bg-[#333]">
                <td className="p-4">#{Math.floor(new Date(order.orderDate).getTime())}</td>
                <td className="p-4">{order.customerDetails.name}</td>
                <td className="p-4">
                  <select
                    className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${
                      order.orderStatus === "Ready" ? "text-green-500" : "text-yellow-500"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id!, e.target.value)}
                  >
                    <option className="text-yellow-500" value="In Progress">In Progress</option>
                    <option className="text-green-500" value="Ready">Ready</option>
                  </select>
                </td>
                <td className="p-4">{formatDateAndTime(order.orderDate)}</td>
                <td className="p-4">{order.items.length} Items</td>
                <td className="p-4">Table - {order.table || "N/A"}</td>
                <td className="p-4">₹{order.bills.totalWithTax}</td>
                <td className="p-4">{order.paymentMethod || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
