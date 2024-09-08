import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { clearNotification } from "../features/notificationSlice";

const AlarmNotification: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector(
    (state: RootState) => state.notification.message
  );

  const handleClose = () => {
    dispatch(clearNotification());
  };

  if (!notification) {
    return null;
  }

  return (
    <div className="notification">
      <p>{notification}</p>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default AlarmNotification;
