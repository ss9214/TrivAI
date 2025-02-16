import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "./gameStateSlice.tsx";

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
