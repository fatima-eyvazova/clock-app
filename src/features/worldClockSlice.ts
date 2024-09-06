import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WorldClockState {
  clocks: { city: string; time: string }[];
}

const initialState: WorldClockState = {
  clocks: [],
};

const worldClockSlice = createSlice({
  name: "worldClock",
  initialState,
  reducers: {
    addClock(state, action: PayloadAction<{ city: string; time: string }>) {
      const existingClock = state.clocks.find(
        (clock) => clock.city === action.payload.city
      );
      if (!existingClock) {
        state.clocks.push(action.payload);
      } else {
        existingClock.time = action.payload.time;
      }
    },
    removeClock(state, action: PayloadAction<string>) {
      state.clocks = state.clocks.filter(
        (clock) => clock.city !== action.payload
      );
    },
  },
});

export const { addClock, removeClock } = worldClockSlice.actions;
export default worldClockSlice.reducer;
