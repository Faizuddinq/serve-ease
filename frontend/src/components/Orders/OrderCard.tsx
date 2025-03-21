import React from "react";
import { FaCheckDouble, FaLongArrowAltRight, FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";
import { Order } from "../../types/apiTypes"; // ✅ Import correct types

// ✅ Define Props Type
interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="w-[500px] bg-[#262626] p-4 rounded-lg mb-4">
      {/* Order Header */}
      <div className="flex items-center gap-5">
        <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
          {getAvatarName(order.customerDetails.name)}
        </button>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              {order.customerDetails.name}
            </h1>
            <p className="text-[#ababab] text-sm">
              #{Math.floor(new Date(order.orderDate).getTime())} / Dine in
            </p>
            <p className="text-[#ababab] text-sm">
              Table{" "}
              <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
              {order.table?.tableNo ?? "N/A"} {/* ✅ Safe access */}
            </p>
          </div>

          {/* Order Status */}
          <div className="flex flex-col items-end gap-2">
            {order.orderStatus === "Ready" ? (
              <>
                <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg">
                  <FaCheckDouble className="inline mr-2" /> {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-green-600" /> Ready to
                  serve
                </p>
              </>
            ) : (
              <>
                <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg">
                  <FaCircle className="inline mr-2" /> {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-yellow-600" /> Preparing
                  your order
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="flex justify-between items-center mt-4 text-[#ababab]">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} Items</p>
      </div>

      <hr className="w-full mt-4 border-t border-gray-500" />

      {/* Order Total */}
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">Total</h1>
        <p className="text-[#f5f5f5] text-lg font-semibold">
          ₹{order.bills?.totalWithTax?.toFixed(2) ?? "0.00"} {/* ✅ Safe access */}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
