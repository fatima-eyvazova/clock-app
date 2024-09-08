import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Alarm {
  id: number;
  time: string;
  isActive: boolean;
}

interface AlarmsState {
  alarms: Alarm[];
}

const initialState: AlarmsState = {
  alarms: [],
};

const alarmsSlice = createSlice({
  name: "alarms",
  initialState,
  reducers: {
    addAlarm: (state, action: PayloadAction<Alarm>) => {
      state.alarms.push(action.payload);
    },
    toggleAlarm: (state, action: PayloadAction<number>) => {
      const alarm = state.alarms.find((a) => a.id === action.payload);
      if (alarm) {
        alarm.isActive = !alarm.isActive;
      }
    },
    deleteAlarm: (state, action: PayloadAction<number>) => {
      state.alarms = state.alarms.filter(
        (alarm) => alarm.id !== action.payload
      );
    },
  },
});

export const { addAlarm, toggleAlarm, deleteAlarm } = alarmsSlice.actions;
export default alarmsSlice.reducer;
