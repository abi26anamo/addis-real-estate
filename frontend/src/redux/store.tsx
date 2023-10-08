import { configureStore, combineReducers } from "@reduxjs/toolkit";
import useReducer from "./user/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  user: useReducer,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: storage,
    version: 1,
  },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer as any,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor  = persistStore(store);