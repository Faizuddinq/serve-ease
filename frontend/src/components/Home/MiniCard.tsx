import React from "react";

// ✅ Define Props Interface
interface MiniCardProps {
  title: string;
  icon: React.ReactNode; // ✅ `icon` is a JSX element
  number: number | string; // ✅ Can be either `number` or `string`
  footerNum: number; // ✅ Ensure it's always a `number`
}

const MiniCard: React.FC<MiniCardProps> = ({ title, icon, number, footerNum }) => {
  return (
    <div className="bg-[#1a1a1a] py-5 px-5 rounded-lg w-[50%]">
      <div className="flex items-start justify-between">
        <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
          {title}
        </h1>
        <button
          className={`${
            title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"
          } p-3 rounded-lg text-[#f5f5f5] text-2xl`}
        >
          {icon}
        </button>
      </div>
      <div>
        <h1 className="text-[#f5f5f5] text-4xl font-bold mt-5">
          {title === "Total Earnings" ? `₹${number}` : number}
        </h1>
        <h1 className="text-[#f5f5f5] text-lg mt-2">
          <span className="text-[#02ca3a]">{footerNum}%</span> than yesterday
        </h1>
      </div>
    </div>
  );
};

export default MiniCard;
