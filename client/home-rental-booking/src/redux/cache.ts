import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Listing, UserState, Trip, Booking } from "../types/types";

// Initial States
const initialState: UserState = {
  user: null,
  token: null,
  profileImagePath: null,
  listings: [],
  wishlist: [],
  properties: [],
  reservations: [],
};

export interface SearchState {
  searchResults: any[];
  loading: boolean;
  error: string | null;
}

const initialSearchState: SearchState = {
  searchResults: [],
  loading: false,
  error: null,
};

// User Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (
      state,
      action: PayloadAction<{
        user: {
          _id: string;
          firstname: string;
          lastname: string;
          Email: string;
          profileImagePath: string;
          triplist?: Trip[];
          WishList: string[];
          properties?: Listing[];
          reservations?: Booking[];
        };
        token: string;
        profileImagePath?: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.profileImagePath = action.payload.profileImagePath || null;

      // Load wishlist from localStorage or use the one from the server
      const savedWishlist = localStorage.getItem("userWishlist");
      state.wishlist = savedWishlist
        ? JSON.parse(savedWishlist)
        : action.payload.user.WishList || [];

      // Load listings from localStorage if available
      const savedListings = localStorage.getItem("wishlistListings");
      if (savedListings) {
        state.listings = JSON.parse(savedListings);
      }
    },
    setLogout: (state) => {
      localStorage.removeItem("wishlistListings");
      localStorage.removeItem("userWishlist");
      state.user = null;
      state.token = null;
      state.profileImagePath = null;
      state.wishlist = [];
      state.properties = [];
      state.reservations = [];
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
        state.user.triplist = [...(state.user.triplist || []), action.payload];
      }
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.wishlist = action.payload;
      if (state.user) {
        state.user.WishList = action.payload;
      }
      localStorage.setItem("userWishlist", JSON.stringify(action.payload));
    },
    setProperties: (state, action: PayloadAction<Listing[]>) => {
      state.properties = action.payload;
      localStorage.setItem("userProperties", JSON.stringify(action.payload));
    },
    setReservation: (state, action: PayloadAction<Booking[]>) => {
      state.reservations = action.payload;
      localStorage.setItem("userReservation", JSON.stringify(action.payload));
    },
  },
});

// Search Slice
export const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload;
      state.error = null;
      state.loading = false;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.searchResults = [];
      state.loading = false;
    },
  },
});

// Export actions
export const {
  setLogin,
  setLogout,
  setListings,
  setTripList,
  addTrip,
  setWishlist,
  setProperties,
  setReservation,
} = userSlice.actions;

export const { setSearchResults, setSearchLoading, setSearchError } =
  searchSlice.actions;

// Export reducers
export const { reducer: userReducer } = userSlice;
export const { reducer: searchReducer } = searchSlice;

export default userReducer;
