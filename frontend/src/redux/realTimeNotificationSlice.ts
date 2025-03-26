import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import INotification from "@/interfaces/notificationInterface";

interface NotificationState {
  notifications: INotification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const realTimeNotificationSlice = createSlice({
  name: "realTimeNotification",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification>) => {
      if (action.payload.type === "like") {
        state.notifications.push(action.payload);
      } else if (action.payload.type === "unlike") {
        state.notifications = state.notifications.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
  },
});

export const { setNotifications } = realTimeNotificationSlice.actions;
export default realTimeNotificationSlice.reducer;
