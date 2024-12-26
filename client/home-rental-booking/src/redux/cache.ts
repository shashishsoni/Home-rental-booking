// cache.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Listing, UserState, Trip , Booking} from "../types/types"; // Import UserState from types.ts


const initialState: UserState = {
  user: null,
  token: null,
  profileImagePath: null,
  listings: [],
  wishlist: [],
  properties: [],
  reservations: [],
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
      state.wishlist = action.payload.user.WishList || [];

      // Load wishlist from localStorage or use the one from the server
      const savedWishlist = localStorage.getItem('userWishlist');
      state.wishlist = savedWishlist ? JSON.parse(savedWishlist) : action.payload.user.WishList || [];
      
      // Load listings from localStorage if available
      const savedListings = localStorage.getItem('wishlistListings');
      if (savedListings) {
        state.listings = JSON.parse(savedListings);
      }
    },
    // Action to handle logout
    setLogout: (state) => {
      // Clear localStorage before resetting state
      localStorage.removeItem('wishlistListings');
      localStorage.removeItem('userWishlist');
      state.user = null;
      state.token = null;
      state.profileImagePath = null;
      state.wishlist = [];
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
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.wishlist = action.payload;
      if (state.user) {
        state.user.WishList = action.payload;
      }
       // Save to localStorage whenever wishlist changes
       localStorage.setItem('userWishlist', JSON.stringify(action.payload));
    },
    setProperties: (state, action: PayloadAction<Listing[]>) => {
      state.properties = action.payload;
      // Save to localStorage
      localStorage.setItem('userProperties', JSON.stringify(action.payload));
    },
    setReservation: (state, action: PayloadAction<Booking[]>) => {
      state.reservations = action.payload;
      // Save to localStorage
      localStorage.setItem('userReservation', JSON.stringify(action.payload));
    },
  },
});

export const { setLogin, setLogout, setListings, setTripList, addTrip, setWishlist, setProperties, setReservation } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Add these types and actions for search
export interface SearchState {
  searchResults: any[];
  loading: boolean;
  error: string | null;
}

const initialSearchState: SearchState = {
  searchResults: [],
  loading: false,
  error: null
};

// Add these action types
export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export const SET_SEARCH_LOADING = 'SET_SEARCH_LOADING';
export const SET_SEARCH_ERROR = 'SET_SEARCH_ERROR';

// Add these action creators
export const setSearchResults = (results: any[]) => ({
  type: SET_SEARCH_RESULTS,
  payload: results
});

export const setSearchLoading = (loading: boolean) => ({
  type: SET_SEARCH_LOADING,
  payload: loading
});

export const setSearchError = (error: string | null) => ({
  type: SET_SEARCH_ERROR,
  payload: error
});

// Update your reducer
export const searchReducer = (state = initialSearchState, action: any): SearchState => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
        error: null,
        loading: false
      };
    case SET_SEARCH_LOADING:
      return {
        ...state,
        loading: action.payload,
        searchResults: state.searchResults,
        error: state.error
      };
    case SET_SEARCH_ERROR:
      return {
        ...state,
        error: action.payload,
        searchResults: [],
        loading: false
      };
    default:
      return state;
  }
};
