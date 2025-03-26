import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.ts";
import postSlice from "./postSlice.ts";
import socketSlice from "./socketSlice.ts";
import chatSlice from "./chatSlice.ts";
import realTimeNotificationSlice from "./realTimeNotificationSlice.ts";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNotification: realTimeNotificationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
