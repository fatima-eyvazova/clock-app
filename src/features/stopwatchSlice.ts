import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StopwatchState {
  time: number;
  isActive: boolean;
  laps: { start: number; end: number }[];
  currentLapStart: number;
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
        state.currentLapStart =
          state.laps.length > 0
            ? state.laps[state.laps.length - 1].end
            : state.time;
      }
    },
    stop(state) {
      if (state.isActive) {
        state.isActive = false;
        if (state.laps.length > 0) {
          state.laps[state.laps.length - 1].end = state.time;
        } else {
          state.laps.push({ start: state.currentLapStart, end: state.time });
        }
      }
    },
    reset(state) {
      if (state.isActive) {
        state.laps.push({ start: state.currentLapStart, end: state.time });
      }
      state.time = 0;
      state.currentLapStart = state.time;
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
      if (state.isActive) {
        state.time = action.payload;
      }
    },
    deleteLap(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < state.laps.length) {
        const newLaps = state.laps.filter((_, i) => i !== index);
        for (let i = 0; i < newLaps.length; i++) {
          if (i > 0) {
            newLaps[i].start = newLaps[i - 1].end;
          }
        }
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

export const { start, stop, reset, addLap, incrementTime, deleteLap } =
  stopwatchSlice.actions;
export default stopwatchSlice.reducer;
