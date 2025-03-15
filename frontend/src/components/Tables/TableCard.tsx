import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";

// ✅ Define TableCard Props (Match API Response)
interface TableCardProps {
  id: string; // ✅ Matches `_id` from API
  tableNo: number;
  status: string;
  initials?: string; // ✅ Optional (if customer name is missing)
  seats: number;
}

const TableCard: React.FC<TableCardProps> = ({ id, tableNo, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (status.toLowerCase() === "booked") return;

    // ✅ Dispatch updated table details
    dispatch(updateTable({ id, tableNo, seats, status: "Booked" }));
    navigate(`/menu`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-76 h-60 hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-lg cursor-pointer"
    >
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[#f5f5f5] text-xl font-semibold">
          Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" /> {tableNo}
        </h1>
        <p
          className={`px-2 py-1 rounded-lg ${
            status.toLowerCase() === "booked"
              ? "text-green-600 bg-[#2e4a40]"
              : "bg-[#664a04] text-white"
          }`}
        >
          {status.toLowerCase() === "booked" ? "Booked" : "Available"}
        </p>
      </div>
      <div className="flex items-center justify-center w-full p-4">
        <h1
          className="text-white rounded p-4 text-xl"
          style={{ backgroundColor: initials ? getBgColor() : "#1f1f1f" }}
        >
          {getAvatarName(initials) || "N/A"}
        </h1>
      </div>
      <p className="text-[#ababab] text-xs">
        Seats: <span className="text-[#f5f5f5]">{seats}</span>
      </p>
    </div>
  );
};

export default TableCard;
