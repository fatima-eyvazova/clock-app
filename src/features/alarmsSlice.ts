import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Alarm {
  id: number;
  time: string;
  isActive: boolean;
}

interface AlarmState {
  alarms: Alarm[];
}

const loadAlarmsFromLocalStorage = (): AlarmState => {
  const savedAlarms = localStorage.getItem("alarmState");
  return savedAlarms ? JSON.parse(savedAlarms) : { alarms: [] };
};

const saveAlarmsToLocalStorage = (state: AlarmState) => {
  localStorage.setItem("alarmState", JSON.stringify(state));
};

const initialState: AlarmState = loadAlarmsFromLocalStorage();

const alarmSlice = createSlice({
  name: "alarm",
  initialState,
  reducers: {
    addAlarm(state, action: PayloadAction<Alarm>) {
      state.alarms.push(action.payload);
      saveAlarmsToLocalStorage(state);
    },
    toggleAlarm(state, action: PayloadAction<number>) {
      const alarm = state.alarms.find((alarm) => alarm.id === action.payload);
      if (alarm) {
        alarm.isActive = !alarm.isActive;
        saveAlarmsToLocalStorage(state);
      }
    },
    deleteAlarm(state, action: PayloadAction<number>) {
      state.alarms = state.alarms.filter(
        (alarm) => alarm.id !== action.payload
      );
      saveAlarmsToLocalStorage(state);
    },
  },
});

export const { addAlarm, toggleAlarm, deleteAlarm } = alarmSlice.actions;
export default alarmSlice.reducer;
