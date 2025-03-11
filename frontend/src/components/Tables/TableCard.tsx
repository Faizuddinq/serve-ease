import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";

// ✅ Define Props Type
interface TableCardProps {
  id: string;
  name: string;
  status: string;
  initials: string;
  seats: number;
}

const TableCard: React.FC<TableCardProps> = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    if (status === "Booked") return;

    // ✅ Dispatch table object
    dispatch(updateTable({ tableId: id, tableNo: name }));
    navigate(`/menu`);
  };

  return (
    <div onClick={handleClick} key={id} className="w-[300px] hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-lg cursor-pointer">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[#f5f5f5] text-xl font-semibold">Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" /> {name}</h1>
        <p className={`${status === "Booked" ? "text-green-600 bg-[#2e4a40]" : "bg-[#664a04] text-white"} px-2 py-1 rounded-lg`}>
          {status}
        </p>
      </div>
      <div className="flex items-center justify-center mt-5 mb-8">
        <h1 className={`text-white rounded-full p-5 text-xl`} style={{ backgroundColor: initials ? getBgColor() : "#1f1f1f" }}>
          {getAvatarName(initials) || "N/A"}
        </h1>
      </div>
      <p className="text-[#ababab] text-xs">Seats: <span className="text-[#f5f5f5]">{seats}</span></p>
    </div>
  );
};

export default TableCard;
