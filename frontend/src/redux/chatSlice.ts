import { createSlice } from "@reduxjs/toolkit";
import IMessage from "../../../backend/interfaces/messageInterface";

interface chatState {
  onlineUsers: any;
  messages: IMessage[];
}

const initialState: chatState = {
  onlineUsers: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setOnlineUsers, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
