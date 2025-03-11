import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define Table State Type
interface TableState {
  tableId: string;
  tableNo: string;
}

// ✅ Define Customer State Type
interface CustomerState {
  orderId: string;
  customerName: string;
  customerPhone: string;
  guests: number;
  table: TableState | null; // ✅ Fix: Store table object instead of string
}

// ✅ Define Initial State
const initialState: CustomerState = {
  orderId: "",
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: null, // ✅ Initially null
};

// ✅ Define Payload Type for `updateTable` Action
interface UpdateTablePayload {
  tableId: string;
  tableNo: string;
}

// ✅ Create Slice with Type-Safe Reducers
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // ✅ Type-safe `setCustomer` Reducer
    setCustomer: (state, action: PayloadAction<Omit<CustomerState, "table">>) => {
      const { customerName, customerPhone, guests } = action.payload;
      state.orderId = `${Date.now()}`;
      state.customerName = customerName;
      state.customerPhone = customerPhone;
      state.guests = guests;
    },

    // ✅ Type-safe `removeCustomer` Reducer
    removeCustomer: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null; // ✅ Reset table to null
    },

    // ✅ Type-safe `updateTable` Reducer
    updateTable: (state, action: PayloadAction<UpdateTablePayload>) => {
      state.table = { tableId: action.payload.tableId, tableNo: action.payload.tableNo };
    },
  },
});

// ✅ Export Actions and Reducer
export const { setCustomer, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;
