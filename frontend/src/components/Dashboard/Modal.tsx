import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTable } from "../../axios";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";

// ✅ Define Props for Modal
interface ModalProps {
  setIsTableModalOpen: (isOpen: boolean) => void;
}

// ✅ Define `TableData` Using New `Table` Type
type TableData = {
  tableNo: number;
  seats: number;
};
const Modal: React.FC<ModalProps> = ({ setIsTableModalOpen }) => {
  const queryClient = useQueryClient();

  // ✅ State for Table Form
  const [tableData, setTableData] = useState<TableData>({
    tableNo: 1,
    seats: 1
  });

  console.log("🚀 Table Modal Opened:", tableData);

  // ✅ Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = Number(value);

    console.log(`✏️ Updating ${name}:`, newValue);

    setTableData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("📤 Submitting Table Data:", tableData);

    if (tableData.tableNo <= 0 || tableData.seats <= 0) {
      console.warn("❌ Invalid Table Data! Table No and Seats must be greater than 0.");
      enqueueSnackbar("Table number & seats must be greater than 0", { variant: "warning" });
      return;
    }

    tableMutation.mutate(tableData);
  };

  // ✅ Mutation for Adding Table
  const tableMutation = useMutation({
    mutationFn: async (reqData: TableData) => {
      console.log("🔄 Sending API Request to Add Table:", reqData);
      const response = await addTable(reqData); // Ensure this matches expected format
      console.log("✅ API Response Received:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("🎉 Table Added Successfully!", data);
      enqueueSnackbar(data.message || "Table added successfully!", { variant: "success" });
  
      // ✅ Refresh `tables` Query
      queryClient.invalidateQueries({ queryKey: ["tables"] });
  
      setIsTableModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("❌ API Error:", error);
      const message = error.response?.data?.message || "Failed to add table!";
      enqueueSnackbar(message, { variant: "error" });
    },
  });
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">Add Table</h2>
          <button
            onClick={() => {
              console.log("❌ Closing Modal...");
              setIsTableModalOpen(false);
            }}
            className="text-[#f5f5f5] hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">Table Number</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="tableNo"
                value={tableData.tableNo}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
                min={1}
              />
            </div>
          </div>
          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">Number of Seats</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="seats"
                value={tableData.seats}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
                min={1}
              />
            </div>
          </div>

          <button
            type="submit"
           
            className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:bg-gray-600"
          >
            Add Table
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;
