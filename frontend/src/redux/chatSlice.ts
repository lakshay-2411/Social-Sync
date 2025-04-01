import { createSlice } from "@reduxjs/toolkit";
import IMessage from "../../../backend/interfaces/messageInterface";

interface chatState {
  onlineUsers: any;
  messages: IMessage[];
  loadingMessages: boolean;
}

const initialState: chatState = {
  onlineUsers: null,
  messages: [],
  loadingMessages: false,
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
      state.loadingMessages = false;
    },
    setLoadingMessages: (state, action) => {
      state.loadingMessages = action.payload;
    },
  },
});

export const { setOnlineUsers, setMessages, setLoadingMessages } =
  chatSlice.actions;
export default chatSlice.reducer;
