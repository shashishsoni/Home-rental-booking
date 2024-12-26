// src/store/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './storecache';  // Make sure this path is correct


// Base selectors - these are internal and shouldn't be exported
const selectUserState = (state: RootState) => state.user;
const selectSearchState = (state: RootState) => state.search;

// User selectors
export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState.user
);

export const selectToken = createSelector(
  [selectUserState],
  (userState) => userState.token
);

export const selectAllListings = createSelector(
    [(state: RootState) => state.user?.listings],
    (listings) => listings || []
  );

export const selectWishlist = createSelector(
  [selectUserState],
  (userState) => userState.wishlist
);

export const selectProperties = createSelector(
    [(state: RootState) => state.user?.properties],
    (properties) => properties || []
  );

export const selectReservations = createSelector(
  [selectUserState],
  (userState) => userState.reservations
);

// Search selectors
export const selectSearchResults = createSelector(
  [selectSearchState],
  (searchState) => searchState.searchResults
);

export const selectSearchLoading = createSelector(
  [selectSearchState],
  (searchState) => searchState.loading
);

export const selectSearchError = createSelector(
  [selectSearchState],
  (searchState) => searchState.error
);

// Complex selectors
export const selectWishlistListings = createSelector(
  [selectAllListings, selectWishlist],
  (listings, wishlist) => listings.filter(listing => wishlist.includes(listing._id))
);

// Create a memoized selector for individual listings by ID
export const makeSelectListingById = () => 
  createSelector(
    [selectAllListings, (_: RootState, id: string) => id],
    (listings, id) => listings.find(listing => listing._id === id)
  );