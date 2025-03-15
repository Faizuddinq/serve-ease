import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";

// Define Component Type
const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // State Hooks
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Modal Handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Guest Count Handlers
  const increment = () => setGuestCount((prev) => Math.min(prev + 1, 6));
  const decrement = () => setGuestCount((prev) => Math.max(prev - 1, 0));

  // Check if Path is Active
  const isActive = (path: string): boolean => location.pathname === path;

  // Handle Order Creation
  const handleCreateOrder = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter valid customer details.");
      return;
    }
    
    dispatch(setCustomer({ customerName:name, customerPhone:phone, guests: guestCount }));
    navigate("/tables");
    closeModal();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around">
      {/* Navigation Buttons */}
      <button
        onClick={() => navigate("/")}
        className={`flex items-center justify-center font-bold w-[300px] rounded-[20px] ${
          isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        }`}
        aria-label="Go to Home"
      >
        <FaHome className="inline mr-2" size={20} />
        <p>Home</p>
      </button>

      <button
        onClick={() => navigate("/orders")}
        className={`flex items-center justify-center font-bold w-[300px] rounded-[20px] ${
          isActive("/orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        }`}
        aria-label="View Orders"
      >
        <MdOutlineReorder className="inline mr-2" size={20} />
        <p>Orders</p>
      </button>

      <button
        onClick={() => navigate("/tables")}
        className={`flex items-center justify-center font-bold w-[300px] rounded-[20px] ${
          isActive("/tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        }`}
        aria-label="View Tables"
      >
        <MdTableBar className="inline mr-2" size={20} />
        <p>Tables</p>
      </button>

      <button
        className="flex items-center justify-center font-bold text-[#ababab] w-[300px]"
        aria-label="More Options"
      >
        <CiCircleMore className="inline mr-2" size={20} />
        <p>More</p>
      </button>

      {/* Floating Create Order Button */}
      <button
        disabled={isActive("/tables") || isActive("/menu")}
        onClick={openModal}
        className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-4 items-center"
        aria-label="Create Order"
      >
        <BiSolidDish size={40} />
      </button>

      {/* Create Order Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium">Customer Name</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter customer name"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">Customer Phone</label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="+91-9999999999"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
            <button onClick={decrement} className="text-yellow-500 text-2xl" aria-label="Decrease Guests">&minus;</button>
            <span className="text-white">{guestCount} {guestCount === 1 ? "Person" : "People"}</span>
            <button onClick={increment} className="text-yellow-500 text-2xl" aria-label="Increase Guests">&#43;</button>
          </div>
        </div>

        <button
          onClick={handleCreateOrder}
          className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700 transition-all"
        >
          Create Order
        </button>
      </Modal>
    </div>
  );
};

export default BottomNav;
