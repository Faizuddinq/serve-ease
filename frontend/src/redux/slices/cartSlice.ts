import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define Cart Item Type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// ✅ Define State Type
type CartState = CartItem[];

const initialState: CartState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Action to Add Items
    addItems: (state, action: PayloadAction<CartItem>) => {
      state.push(action.payload);
    },

    // ✅ Action to Remove Item
    removeItem: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },

    // ✅ Action to Remove All Items
    removeAllItems: () => {
      return [];
    },
  },
});

// ✅ Selector for Total Price
export const getTotalPrice = (state: { cart: CartState }): number =>
  state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

export const { addItems, removeItem, removeAllItems } = cartSlice.actions;
export default cartSlice.reducer;
