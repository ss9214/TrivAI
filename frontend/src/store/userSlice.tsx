import { createSlice } from "@reduxjs/toolkit";
import { UserStatus } from "../../../models/GameState";
const userStatuses: UserStatus[] = [
  { userId: "123", name: "Attila", lifePoints: 1, rank: 1 },
];

export const userSlice = createSlice({
  name: "user",
  initialState: userStatuses[0] as UserStatus | null,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
