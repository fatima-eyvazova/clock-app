import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  time: number;
  isActive: boolean;
  history: { startTime: number; endTime: number }[];
  lastLapStartTime?: number;
}

const initialState: TimerState = {
  time: 0,
  isActive: false,
  history: [],
  lastLapStartTime: undefined,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setTime(state, action: PayloadAction<number>) {
      state.time = action.payload;
    },

    start(state) {
      state.isActive = true;
      if (state.lastLapStartTime === undefined) {
        state.lastLapStartTime = state.time;
      }
    },
    stop(state) {
      state.isActive = false;
      if (state.lastLapStartTime !== undefined) {
        state.history.push({
          startTime: state.lastLapStartTime,
          endTime: state.time,
        });
        state.lastLapStartTime = undefined;
      }
    },
    reset(state) {
      state.time = 0;
      state.isActive = false;
      state.lastLapStartTime = undefined;
    },
    incrementTime(state, action: PayloadAction<number>) {
      if (state.isActive) {
        state.time += action.payload;
      }
    },
  },
});

export const { setTime, start, stop, reset, incrementTime } =
  timerSlice.actions;
export default timerSlice.reducer;
