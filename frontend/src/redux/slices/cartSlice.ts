import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Import RootState for the selector

// ✅ Define Cart Item Type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// ✅ Define Initial State Type
type CartState = CartItem[];

// ✅ Define Initial State
const initialState: CartState = [];

// ✅ Create Slice with Type-Safe Reducers
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Type-Safe `addItems` Reducer
    addItems: (state, action: PayloadAction<CartItem>) => {
      state.push(action.payload);
    },

    // ✅ Type-Safe `removeItem` Reducer
    removeItem: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },

    // ✅ FIX: Directly Mutate State Instead of Returning a New Object
    removeAllItems: (state) => {
      state.length = 0; // Clears the array instead of returning a new one
    },
  },
});

// ✅ FIX: Type-Safe Selector for Total Price
export const getTotalPrice = (state: RootState): number =>
  state.cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);

// ✅ Export Actions and Reducer
export const { addItems, removeItem, removeAllItems } = cartSlice.actions;
export default cartSlice.reducer;
