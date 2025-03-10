import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define Customer State Type
interface CustomerState {
  orderId: string;
  customerName: string;
  customerPhone: string;
  guests: number;
  table: string | null;
}

// ✅ Define Initial State
const initialState: CustomerState = {
  orderId: "",
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: null,
};

// ✅ Define Payload Type for `setCustomer` Action
interface SetCustomerPayload {
  name: string;
  phone: string;
  guests: number;
}

// ✅ Define Payload Type for `updateTable` Action
interface UpdateTablePayload {
  table: string;
}

// ✅ Create Slice with Type-Safe Reducers
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // ✅ Type-Safe `setCustomer` Reducer
    setCustomer: (state, action: PayloadAction<SetCustomerPayload>) => {
      const { name, phone, guests } = action.payload;
      state.orderId = `${Date.now()}`;
      state.customerName = name;
      state.customerPhone = phone;
      state.guests = guests;
    },

    // ✅ Type-Safe `removeCustomer` Reducer
    removeCustomer: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
    },

    // ✅ Type-Safe `updateTable` Reducer
    updateTable: (state, action: PayloadAction<UpdateTablePayload>) => {
      state.table = action.payload.table;
    },
  },
});

// ✅ Export Actions and Reducer
export const { setCustomer, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;
