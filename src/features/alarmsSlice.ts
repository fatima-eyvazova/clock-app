import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Alarm {
  id: number;
  time: string;
  isActive: boolean;
}

interface AlarmState {
  alarms: Alarm[];
}

const initialState: AlarmState = {
  alarms: [],
};

const alarmSlice = createSlice({
  name: "alarm",
  initialState,
  reducers: {
    addAlarm(state, action: PayloadAction<Alarm>) {
      state.alarms.push(action.payload);
    },
    toggleAlarm(state, action: PayloadAction<number>) {
      const alarm = state.alarms.find((a) => a.id === action.payload);
      if (alarm) {
        alarm.isActive = !alarm.isActive;
      }
    },
    deleteAlarm(state, action: PayloadAction<number>) {
      state.alarms = state.alarms.filter((a) => a.id !== action.payload);
    },
  },
});

export const { addAlarm, toggleAlarm, deleteAlarm } = alarmSlice.actions;
export default alarmSlice.reducer;
