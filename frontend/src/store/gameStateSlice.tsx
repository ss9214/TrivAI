import { createSlice } from "@reduxjs/toolkit";
import { GameState } from "../../../models/GameState";

export const gameStateSlice = createSlice({
  name: "users",
  initialState: null as GameState | null,
  reducers: {
    setGameState: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setGameState } = gameStateSlice.actions;
export default gameStateSlice.reducer;
