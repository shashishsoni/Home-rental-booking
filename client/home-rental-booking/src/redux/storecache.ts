// storecache.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from "./cache";
import { searchReducer } from './cache';

// Create root reducer
const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer
});

// Basic persist config
const persistConfig = {
  key: "root",
  storage,
  blacklist: [] // Don't persist any reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with basic config
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});

const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
