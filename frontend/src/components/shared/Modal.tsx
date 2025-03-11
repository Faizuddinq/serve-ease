import React, { ReactNode } from "react";
import { motion } from "framer-motion";

// ** Define Props Interface **
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#1a1a1a] rounded-lg shadow-lg w-full max-w-lg mx-4"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-b-[#333]">
          <h2 id="modal-title" className="text-xl text-[#f5f5f5] font-semibold">
            {title}
          </h2>
          <button
            className="text-gray-500 text-2xl hover:text-gray-800"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
