import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/Orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../axios";
import { enqueueSnackbar } from "notistack";
import { OrderResponse, Order } from "../types/apiTypes";
import { AxiosError } from "axios";

const Orders: React.FC = () => {
  const [status, setStatus] = useState<"all" | "progress" | "ready" | "completed">("all");

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  // ✅ Fetch Orders with Type Safety
  const { data: resData, isError } = useQuery<OrderResponse, AxiosError>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await getOrders();
      return response.data; // ✅ Ensure we're using the correct `data`
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // ✅ Filter Orders Based on Status
  const filteredOrders = resData?.data?.filter((order: Order) => {
    if (status === "all") return true;
    return order.orderStatus.toLowerCase() === status;
  });

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Orders
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          {["all", "progress", "ready", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatus(tab as "all" | "progress" | "ready" | "completed")}
              className={`text-[#ababab] text-lg ${
                status === tab ? "bg-[#383838] rounded-lg px-5 py-2" : ""
              } rounded-lg px-5 py-2 font-semibold`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-16 py-4 overflow-y-scroll scrollbar-hide">
        {filteredOrders && filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
        ) : (
          <p className="col-span-3 text-gray-500">No orders available</p>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
