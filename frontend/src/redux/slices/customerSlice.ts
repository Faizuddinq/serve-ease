import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define Item Interface (Used in Orders)
interface IItem {
  name: string;
  price: number;
  quantity: number;
}

// ✅ Define Order Interface (Matches Order Model)
interface IOrder {
  _id: string;
  customerDetails: {
    name: string;
    phone: string;
    guests: number;
  };
  orderStatus: string;
  orderDate: string;
  bills: {
    total: number;
    tax: number;
    totalWithTax: number;
  };
  items: IItem[];
  table: string; // Reference to table's `_id`
  paymentMethod?: string;
  paymentData?: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
  };
}



// ✅ Define Table Interface (Aligned with MongoDB)
export interface Table {
  id: string; // ✅ Matches MongoDB `_id`
  tableNo: number;
  seats: number;
  status: string; // ✅ Enforced valid statuses
  currentOrder?: IOrder | null; // ✅ Reference to the current order, if any
}

// ✅ Define Customer State Type
export interface CustomerState {
  orderId: string;
  customerName: string;
  customerPhone: string;
  guests: number;
  table: Table | null; // ✅ Uses the updated Table interface
}

// ✅ Initial State
const initialState: CustomerState = {
  orderId: "",
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // ✅ Set Customer Data (Partial Update Supported)
    setCustomer: (state, action: PayloadAction<Partial<CustomerState>>) => {
      state.orderId = action.payload.orderId || `${Date.now()}`;
      state.customerName = action.payload.customerName || "";
      state.customerPhone = action.payload.customerPhone || "";
      state.guests = action.payload.guests || 0;
    },

    // ✅ Update Table (Uses new Table interface)
    updateTable: (state, action: PayloadAction<Table>) => {
      state.table = action.payload;
    },

    // ✅ Remove Customer Data
    removeCustomer: (state) => {
      state.orderId = "";
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
    },
  },
});

// ✅ Export Actions & Reducer
export const { setCustomer, updateTable, removeCustomer } = customerSlice.actions;
export default customerSlice.reducer;
