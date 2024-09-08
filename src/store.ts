import { configureStore } from "@reduxjs/toolkit";
import alarmReducer from "./features/alarmsSlice";
import stopwatchReducer from "./features/stopwatchSlice";
import timerReducer from "./features/timerSlice";
import worldClockReducer from "./features/worldClockSlice";
import audioReducer from "./features/audioSlice";
import notificationReducer from "./features/notificationSlice";

export const store = configureStore({
  reducer: {
    alarm: alarmReducer,
    stopwatch: stopwatchReducer,
    timer: timerReducer,
    worldClock: worldClockReducer,
    audio: audioReducer,
    notification: notificationReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
