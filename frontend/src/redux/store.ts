import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
  reducer: {
    customer: customerSlice,
    cart: cartSlice,
    user: userSlice,
  },
  devTools: import.meta.env.MODE !== "production", // ✅ Fix: Correct way to check env mode
});

// ✅ Infer `RootState` and `AppDispatch` Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Export Store
export default store;
