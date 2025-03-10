import React from "react";
import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../axios/index";
import { OrderResponse } from "../../types/apiTypes";
import { AxiosError } from "axios";

const RecentOrders: React.FC = () => {
  // ✅ Fetch Orders with Type-Safety
  const { data: resData, isError } = useQuery<OrderResponse, AxiosError>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await getOrders();
      return response.data; // ✅ Extract data from Axios response
    },
    placeholderData: { success: false, data: [] }, // ✅ Provide a default empty array
  });

  // ✅ Handle Errors
  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  return (
    <div className="px-8 mt-6">
      <div className="bg-[#1a1a1a] w-full h-[450px] rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Recent Orders
          </h1>
          <a href="#" className="text-[#025cca] text-sm font-semibold">
            View all
          </a>
        </div>

        {/* ✅ Search Input */}
        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mx-6">
          <FaSearch className="text-[#f5f5f5]" />
          <input
            type="text"
            placeholder="Search recent orders"
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5]"
          />
        </div>

        {/* ✅ Order List with Safe Length Check */}
        <div className="mt-4 px-6 overflow-y-scroll h-[300px] scrollbar-hide">
          {resData?.data && resData.data.length > 0 ? ( // ✅ Safe check before accessing length
            resData.data.map((order) => <OrderList key={order._id} order={order} />)
          ) : (
            <p className="text-gray-500">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
