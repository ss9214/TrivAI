import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.tsx";
import gameStateReducer from "./gameStateSlice.tsx";

export const store = configureStore({
  reducer: {
    user: userReducer,
    gameState: gameStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
