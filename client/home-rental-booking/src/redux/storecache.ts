// storecache.ts
import { configureStore } from "@reduxjs/toolkit";
import { UserState } from "../types/types";
import userReducer from "./cache";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistedState,
  PersistConfig,
  PersistState
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { searchReducer } from './cache';
import { SearchState } from './cache';

// Define the root state type
export interface RootState {
  user: UserState;
  search: SearchState;
}

// Define our custom state structure
interface CustomState {
  user: {
    user: UserState["user"];
    token: string | null;
    profileImagePath: string | null;
  };
  _persist: PersistState;
}

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer
});


// Type-safe migration functions
type MigrationFunction = (state: PersistedState) => Promise<PersistedState>;

const migrations: Record<number, MigrationFunction> = {
  0: async (_: PersistedState): Promise<PersistedState> => {
    return {
      user: {
        user: null,
        token: null,
        profileImagePath: null,
      },
      _persist: { version: 0, rehydrated: true }
    } as PersistedState;
  },
  1: async (state: PersistedState): Promise<PersistedState> => {
    const currentState = state as CustomState;
    return {
      user: {
        user: currentState?.user?.user || null,
        token: currentState?.user?.token || null,
        profileImagePath: currentState?.user?.profileImagePath || null,
      },
      _persist: { version: 1, rehydrated: true }
    } as PersistedState;
  }
};

// Persist configuration
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
  migrate: async (state: PersistedState): Promise<PersistedState> => {
    if (!state) return migrations[0](state);
    const version = (state as CustomState)?._persist?.version || 0;
    const migrate = migrations[version];
    return migrate ? await migrate(state) : migrations[0](state);
  },
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);
export const getStore = () => store;
export const getPersistor = () => persistor;
