import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { addTable } from "../../axios";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";
import { TableRequest, TableResponse } from "../../types/apiTypes"; // ✅ Import interfaces

// ✅ Define Props Type
interface ModalProps {
  setIsTableModalOpen: (isOpen: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ setIsTableModalOpen }) => {
  const [tableData, setTableData] = useState<TableRequest>({
    tableNo: 0,
    seats: 0,
  });

  // ✅ Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTableData((prev) => ({
      ...prev,
      [name]: Math.max(1, Number(value)), // Prevents negative & zero values
    }));
  };

  // ✅ Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(tableData);
    tableMutation.mutate(tableData);
  };

  // ✅ Handle Modal Close
  const handleCloseModal = () => {
    setIsTableModalOpen(false);
  };

  // ✅ Mutation Hook for Adding Table
  const tableMutation = useMutation<TableResponse, AxiosError<{ message: string }>, TableRequest>({
    mutationFn: async (newTable: TableRequest) => {
      const response = await addTable(newTable); // ✅ API Call Here
      return response.data; // ✅ Extract the data property
    },
    onSuccess: (res) => {
      setIsTableModalOpen(false);
      enqueueSnackbar(res.message, { variant: "success" });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Something went wrong!";
      enqueueSnackbar(message, { variant: "error" });
      console.error(error);
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
            onClick={handleCloseModal}
            className="text-[#f5f5f5] hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          {/* Table Number Input */}
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Table Number
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="tableNo"
                value={tableData.tableNo || ""}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                min="1"
                required
              />
            </div>
          </div>

          {/* Number of Seats Input */}
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Number of Seats
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="seats"
                value={tableData.seats || ""}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                min="1"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg mt-10 mb-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
            disabled={tableMutation.isPending}
          >
            {tableMutation.isPending ? "Adding..." : "Add Table"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;
