import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store"; // Import your RootState type

const Greetings: React.FC = () => {
  // ✅ Type-safe Redux selector
  const userData = useSelector((state: RootState) => state.user);
  const [dateTime, setDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Type-safe formatDate function
  const formatDate = (date: Date): string => {
    const months: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()}`;
  };

  // ✅ Type-safe formatTime function
  const formatTime = (date: Date): string =>
    `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  return (
    <div className="flex justify-between items-center px-8 mt-5">
      <div>
        <h1 className="text-[#f5f5f5] text-2xl font-semibold tracking-wide">
          Good Morning, {userData?.name || "TEST USER"}
        </h1>
        <p className="text-[#ababab] text-sm">
          Give your best services for customers 😀
        </p>
      </div>
      <div>
        <h1 className="text-[#f5f5f5] text-3xl font-bold tracking-wide w-[130px]">
          {formatTime(dateTime)}
        </h1>
        <p className="text-[#ababab] text-sm">{formatDate(dateTime)}</p>
      </div>
    </div>
  );
};

export default Greetings;
