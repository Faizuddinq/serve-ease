import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define Table Type (Updated)
interface Table {
  id: string;  // ✅ Matches API `_id`
  tableNo: number;
  seats: number;
  status: string;
}

// ✅ Define Customer State Type
interface CustomerState {
  orderId: string;
  customerName: string;
  customerPhone: string;
  guests: number;
  table: Table | null;
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
    // ✅ Set Customer Data (Allow Partial Updates)
    setCustomer: (state, action: PayloadAction<Partial<CustomerState>>) => {
      state.orderId = action.payload.orderId || `${Date.now()}`;
      state.customerName = action.payload.customerName || "";
      state.customerPhone = action.payload.customerPhone || "";
      state.guests = action.payload.guests || 0;
    },

    // ✅ Update Table (Fixed)
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
