import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/Tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../axios";
import { enqueueSnackbar } from "notistack";
import { TableResponse, Table } from "../types/apiTypes";
import { AxiosError } from "axios";

const Tables: React.FC = () => {
  const [status, setStatus] = useState<"all" | "booked">("all");

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  // ✅ Fetch Tables with Type Safety
  const { data: resData, isError } = useQuery<TableResponse, AxiosError>({
    queryKey: ["tables"],
    queryFn: async () => {
      const response = await getTables();
      return response.data; // ✅ Ensure we're using the correct `data`
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  console.log(resData);

  // ✅ Filter Tables Based on Status
  const filteredTables = resData?.data?.filter((table: Table) => {
    if (status === "all") return true;
    return table.status?.toLowerCase() === "booked";
  });

  return (
    <section className="bg-[#ecc4c4]  overflow-hidden">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          {["all", "booked"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatus(tab as "all" | "booked")}
              className={`text-[#ababab] text-lg ${
                status === tab ? "bg-[#383838] rounded-lg px-5 py-2" : ""
              } rounded-lg px-5 py-2 font-semibold`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 px-16 py-4 h-[650px] overflow-y-scroll scrollbar-hide">
        {filteredTables && filteredTables.length > 0 ? (
          filteredTables.map((table) => (
            <TableCard
              key={table._id}
              id={table._id || ""}
              name={table.tableNo}
              status={table.status || "Available"}
              initials={table?.currentOrder || "N/A"}
              seats={table.seats}
            />
          ))
        ) : (
          <p className="col-span-5 text-gray-500">No tables available</p>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
