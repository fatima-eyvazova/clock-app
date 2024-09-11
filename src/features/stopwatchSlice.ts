import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StopwatchState {
  time: number;
  isActive: boolean;
  laps: { start: number; end: number }[];
  currentLapStart: number;
  hasReset: boolean;
}

const loadStateFromLocalStorage = (): StopwatchState => {
  const savedState = localStorage.getItem("stopwatchState");
  return savedState
    ? JSON.parse(savedState)
    : {
        time: 0,
        isActive: false,
        laps: [],
        currentLapStart: 0,
        hasReset: false,
      };
};

const initialState: StopwatchState = loadStateFromLocalStorage();

const stopwatchSlice = createSlice({
  name: "stopwatch",
  initialState,
  reducers: {
    start(state) {
      if (!state.isActive) {
        state.isActive = true;
        if (state.hasReset) {
          state.laps.push({ start: state.currentLapStart, end: state.time });
          state.hasReset = false;
        } else {
          state.currentLapStart = state.time;
        }
      }
    },
    stop(state) {
      if (state.isActive) {
        state.isActive = false;
        if (
          state.laps.length === 0 ||
          state.laps[state.laps.length - 1].end === undefined
        ) {
          state.laps.push({ start: state.currentLapStart, end: state.time });
        } else {
          state.laps[state.laps.length - 1].end = state.time;
        }
      }
    },
    reset(state) {
      state.time = 0;
      state.currentLapStart = 0;
      state.hasReset = true;
    },
    addLap(state) {
      if (state.isActive) {
        const lapStart = state.currentLapStart;
        const end = state.time;
        state.laps.push({ start: lapStart, end: end });
        state.currentLapStart = end;
      }
    },
    incrementTime(state) {
      if (state.isActive) {
        state.time += 1;
      }
    },
    setTime(state, action: PayloadAction<number>) {
      state.time = action.payload;
    },
    deleteLap(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < state.laps.length) {
        const newLaps = state.laps.filter((_, i) => i !== index);
        state.laps = newLaps;
        if (state.laps.length > 0) {
          state.currentLapStart = state.laps[state.laps.length - 1].end;
        } else {
          state.currentLapStart = 0;
        }
      }
    },
  },
});

export const { start, stop, reset, addLap, incrementTime, deleteLap, setTime } =
  stopwatchSlice.actions;
export default stopwatchSlice.reducer;
