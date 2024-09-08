import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  message: string;
}

const initialState: NotificationState = {
  message: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearNotification: (state) => {
      state.message = "";
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
