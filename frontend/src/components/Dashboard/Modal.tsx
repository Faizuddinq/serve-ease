import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import { addTable } from "../../axios";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";

// ✅ Define Props for Modal
interface ModalProps {
  setIsTableModalOpen: (isOpen: boolean) => void;
}

// ✅ Define Table Data Type
interface TableData {
  tableNo: number;
  seats: number;
}

const Modal: React.FC<ModalProps> = ({ setIsTableModalOpen }) => {
  const [tableData, setTableData] = useState<TableData>({
    tableNo: 0,
    seats: 0,
  });

  // ✅ Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tableMutation.mutate(tableData);
  };

  // ✅ Close Modal
  const handleCloseModal = () => {
    setIsTableModalOpen(false);
  };

  // ✅ Mutation for Adding Table
  const tableMutation = useMutation({
    mutationFn: async (reqData: TableData) => {
      const response = await addTable(reqData);
      return response.data; // ✅ Ensure correct return type
    },
    onSuccess: (data) => {
      setIsTableModalOpen(false);
      enqueueSnackbar(data.message, { variant: "success" });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message || "Failed to add table!";
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
          <button onClick={handleCloseModal} className="text-[#f5f5f5] hover:text-red-500">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">Table Number</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="tableNo"
                value={tableData.tableNo}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">Number of Seats</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="seats"
                value={tableData.seats}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg mt-10 mb-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
          >
            Add Table
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Modal;
