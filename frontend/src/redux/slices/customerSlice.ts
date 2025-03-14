import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define Table State Type
interface TableState {
  tableId: string;
  tableNo: number;
}

// ✅ Define Customer State Type
export interface CustomerState {
  orderId: string;
  customerName: string;
  customerPhone: string;
  guests: number;
  table: TableState | null;
}

// ✅ Define Initial State
const initialState: CustomerState = {
  orderId: "",
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: null,
};

// ✅ Define Payload Type for `updateTable` Action
interface UpdateTablePayload {
  tableId: string;
  tableNo: number;
}

// ✅ Create Slice with Type-Safe Reducers
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // ✅ Type-safe `setCustomer` Reducer
    setCustomer: (state, action: PayloadAction<CustomerState>) => {
      state.orderId = action.payload.orderId;
      state.customerName = action.payload.customerName;
      state.customerPhone = action.payload.customerPhone;
      state.guests = action.payload.guests;
      state.table = action.payload.table; // ✅ Ensure table is set correctly
    },

    // ✅ Type-safe `removeCustomer` Reducer
    removeCustomer: (state) => {
      state.orderId = "";
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null; // ✅ Reset table to null
    },

    // ✅ Type-safe `updateTable` Reducer
    updateTable: (state, action: PayloadAction<UpdateTablePayload>) => {
      if (state.table) {
        state.table.tableId = action.payload.tableId;
        state.table.tableNo = action.payload.tableNo;
      } else {
        state.table = {
          tableId: action.payload.tableId,
          tableNo: action.payload.tableNo,
        };
      }
    },
  },
});

// ✅ Export Actions and Reducer
export const { setCustomer, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;
