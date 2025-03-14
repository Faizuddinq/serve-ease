import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Ensure correct store import

// Define User State Type
interface UserState {
  _id: string; // Matches API response field
  name: string;
  email: string;
  phone?: string; // Made optional
  role: string;
  isAuth: boolean;
}

// Define Initial State
const initialState: UserState = {
  _id: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  isAuth: false,
};

// Define Payload Type for `setUser` Action
interface SetUserPayload {
  _id: string; // Matches API response field
  name: string;
  email: string;
  phone?: string;
  role: string;
}

// Create Slice with Type-Safe Reducers
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set User Data from API
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const { _id, name, phone, email, role } = action.payload;
      state._id = _id; // Matches API response
      state.name = name;
      state.phone = phone || ""; // Prevents `undefined` errors
      state.email = email;
      state.role = role;
      state.isAuth = true;
    },

    // Clear User Data on Logout/Error
    removeUser: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.phone = "";
      state.role = "";
      state.isAuth = false;
    },

    // Partial User Update (Flexible)
    setSUser: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload); // Merges new data into state
    },
  },
});

// Selector to Get User State
export const selectUser = (state: RootState) => state.user;

// Export Actions and Reducer
export const { setUser, removeUser, setSUser } = userSlice.actions;
export default userSlice.reducer;
