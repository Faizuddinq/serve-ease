import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/Tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../axios";
import { enqueueSnackbar } from "notistack";  // ✅ Added missing import

const Tables: React.FC = () => {
  const [status, setStatus] = useState<"all" | "booked">("all");

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => await getTables(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Tables</h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          <button
            onClick={() => setStatus("all")}
            className={`text-[#ababab] text-lg ${status === "all" ? "bg-[#383838] rounded-lg px-5 py-2" : ""} font-semibold`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-[#ababab] text-lg ${status === "booked" ? "bg-[#383838] rounded-lg px-5 py-2" : ""} font-semibold`}
          >
            Booked
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 px-16 py-4 h-[650px] overflow-y-scroll scrollbar-hide">
        {resData?.data.data.map((table) => (
          <TableCard
            key={table._id}
            id={table._id}  // ✅ Matches TableCard prop
            tableNo={table.tableNo}
            status={table.status}
            initials={table?.currentOrder?.customerDetails?.name || ""}  // ✅ Ensures initials is not undefined
            seats={table.seats}
          />
        ))}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
