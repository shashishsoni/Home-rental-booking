import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './storecache';

// Base selectors with null checks
const selectUserState = (state: RootState) => state.user || {};
const selectSearchState = (state: RootState) => state.search || {};

// User selectors with safe fallbacks
export const selectUser = createSelector(
  [selectUserState],
  (userState) => userState.user || null
);

export const selectToken = createSelector(
  [selectUserState],
  (userState) => userState.token || null
);

// Update selectAllListings to use base selector
export const selectAllListings = createSelector(
  [selectUserState],
  (userState) => userState.listings || []
);

export const selectWishlist = createSelector(
  [selectUserState],
  (userState) => userState.wishlist || []
);

export const selectProperties = createSelector(
  [selectUserState],
  (userState) => userState.properties || []
);

export const selectReservations = createSelector(
  [selectUserState],
  (userState) => userState.reservations || []
);

// Search selectors with safe fallbacks
export const selectSearchResults = createSelector(
  [selectSearchState],
  (searchState) => searchState.searchResults || []
);

export const selectSearchLoading = createSelector(
  [selectSearchState],
  (searchState) => searchState.loading || false
);

export const selectSearchError = createSelector(
  [selectSearchState],
  (searchState) => searchState.error || null
);

// Complex selectors with type safety and null checks
export const selectWishlistListings = createSelector(
  [selectAllListings, selectWishlist],
  (listings, wishlist) => 
    listings.filter(listing => 
      listing && listing._id && wishlist.includes(listing._id)
    )
);

// Type-safe memoized selector for individual listings
export const makeSelectListingById = () =>
  createSelector(
    [selectAllListings, (_: RootState, id: string) => id],
    (listings, id) => 
      listings.find(listing => listing && listing._id === id) || null
  );