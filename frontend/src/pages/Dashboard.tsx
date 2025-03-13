import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/Dashboard/Metrics";
import RecentOrders from "../components/Dashboard/RecentOrders";
import Modal from "../components/Dashboard/Modal";

// ✅ Define types for buttons and tabs
interface DashboardButton {
  label: string;
  icon: React.ReactNode;
  action: string;
}

// ✅ Define buttons with proper types
const buttons: DashboardButton[] = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs: string[] = ["Metrics", "Orders", "Payments"];

const Dashboard: React.FC = () => {
  useEffect(() => {
    document.title = "ServeEase | Admin Dashboard";
  }, []);

  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Metrics");

  // ✅ Type the function argument
  const handleOpenModal = (action: string) => {
    if (action === "table") setIsTableModalOpen(true);
  };

  return (
    <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)]">
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }) => (
            <button
              key={action} // ✅ Added key
              onClick={() => handleOpenModal(action)}
              className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
            >
              {label} {icon}
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3">
          {tabs.map((tab) => (
            <button
              key={tab} // ✅ Added key
              className={`
                px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-[#262626]"
                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Component Rendering */}
      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Orders" && <RecentOrders />}
      {activeTab === "Payments" && (
        <div className="text-white p-6 container mx-auto">
          Payment Dashboard Component Coming Soon
        </div>
      )}

      {/* Modal */}
      {isTableModalOpen && <Modal setIsTableModalOpen={setIsTableModalOpen} />}
    </div>
  );
};

export default Dashboard;
