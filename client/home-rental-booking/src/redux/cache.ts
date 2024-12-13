// cache.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Listing, UserState} from "../types/types";  // Import UserState from types.ts

const initialState: UserState = {
  user: null,
  token: null,
  profileImagePath: null,
  listings: [],
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
      state.listings = [];
    },
    setListings: (state, action: PayloadAction<Listing[]>) => {
      state.listings = action.payload;  // Directly assign the listings array
    }
  },
});

// Export actions
export const { setLogin, setLogout, setListings } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
