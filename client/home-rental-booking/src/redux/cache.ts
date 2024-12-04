// cache.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../types/types";  // Import UserState from types.ts

const initialState: UserState = {
  user: null,
  token: null,
  profileImagePath: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to handle login
    setLogin: (
      state: UserState,
      action: PayloadAction<{
        user: {
          _id: string;
          firstname: string;
          lastname: string;
          Email: string;
          profileImagePath: string;
        };
        token: string;
        profileImagePath?: string;
      }>
    ) => {
      console.log("Logging in with", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.profileImagePath = action.payload.profileImagePath || null;
    },
    // Action to handle logout
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.profileImagePath = null;
    },
  },
});

// Export actions
export const { setLogin, setLogout } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
