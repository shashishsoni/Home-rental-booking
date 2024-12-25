// cache.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Listing, UserState, Trip } from "../types/types"; // Import UserState from types.ts

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
          triplist?: Trip[];
        };
        token: string;
        profileImagePath?: string;
      }>
    ) => {
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
    setListings: (state, action: PayloadAction<Listing[]>) => {
      state.listings = action.payload;
    },
    setTripList: (state, action: PayloadAction<Trip[]>) => {
      if (state.user) {
        state.user.triplist = action.payload;
      }
    },
    addTrip: (state, action: PayloadAction<Trip>) => {
      if (state.user) {
        if (!state.user.triplist) {
          state.user.triplist = [];
        }
        state.user.triplist.push(action.payload);
      }
    },
  },
});

export const { setLogin, setLogout, setListings, setTripList, addTrip } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
