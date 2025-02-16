import { createSlice } from "@reduxjs/toolkit";
import { GameState } from "../../../models/GameState";
const gameState: GameState = {
  userStatuses: [
    { userId: "123", name: "Attila Palabiyik", lifePoints: 4321, rank: 1 },
    { userId: "456", name: "Srihari Srivatsa", lifePoints: 1111, rank: 3 },
    { userId: "789", name: "Sidd Arvind", lifePoints: 4200, rank: 2 },
  ],
  question_index: 0,
  questionDisplay: {
    text: "This is the question",
    options: [
      "This is option 1",
      "This is option 2",
      "This is option 3",
      "This is option 4",
    ],
  },
  owner: "123",
  status: "active",
};

export const gameStateSlice = createSlice({
  name: "users",
  initialState: gameState as GameState | null,
  reducers: {
    setGameState: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setGameState } = gameStateSlice.actions;
export default gameStateSlice.reducer;
