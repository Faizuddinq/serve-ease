import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-[#025cca] p-2 text-xl font-bold rounded-full text-white 
                 hover:bg-[#014a9a] focus:ring-2 focus:ring-blue-300 transition-all"
      aria-label="Go back"
    >
      <IoArrowBackOutline />
    </button>
  );
};

export default BackButton;
