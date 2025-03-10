import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store"; // ✅ Import RootState

// ✅ Define User State Type
interface UserState {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isAuth: boolean;
}

// ✅ Define Initial State
const initialState: UserState = {
  _id: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  isAuth: false,
};

// ✅ Define Payload Type for `setUser` Action
interface SetUserPayload {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// ✅ Create Slice with Type-Safe Reducers
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Type-Safe `setUser` Reducer
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const { _id, name, phone, email, role } = action.payload;
      state._id = _id;
      state.name = name;
      state.phone = phone;
      state.email = email;
      state.role = role;
      state.isAuth = true;
    },

    // ✅ FIX: Directly Mutate State Instead of Returning a New Object
    removeUser: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.phone = "";
      state.role = "";
      state.isAuth = false;
    },
  },
});

// ✅ Selector to get user state from RootState
export const selectUser = (state: RootState) => state.user;

// ✅ Export Actions and Reducer
export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
