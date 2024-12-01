import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cache from "../redux/cache"; // Import your root reducer

// Persist configuration
const persistConfig = {
  key: "root", // The key under which the persisted state is stored in localStorage
  version: 1, // Allows versioning to handle migrations
  storage, // Use localStorage as the default storage
};

// Create a persisted reducer by combining the persist config and root reducer
const persistedReducer = persistReducer(persistConfig, cache);

// Configure and create the Redux store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore actions that redux-persist uses, which are not serializable
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor to persist and rehydrate the store
export const persistor = persistStore(store);
