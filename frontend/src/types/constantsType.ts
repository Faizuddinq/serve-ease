export interface IDish {
    id: number;
    image: string; // ✅ Path to image file
    name: string;
    numberOfOrders: number;
  }
  
  // ✅ Define Type for Tables
export interface ITable {
    id: number;
    name: string;
    status: "Booked" | "Available"; // ✅ Enforcing status type
    initial: string;
    seats: number;
  }
  