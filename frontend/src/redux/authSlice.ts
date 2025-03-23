import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../../../backend/interfaces/userInterface";

interface AuthState {
  user: IUser | null;
  suggestedUsers: IUser[];
}

const initialState: AuthState = {
  user: null,
  suggestedUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action: PayloadAction<IUser[]>) => {
      state.suggestedUsers = action.payload;
    },
  },
});

export const { setAuthUser, setSuggestedUsers } = authSlice.actions;
export default authSlice.reducer;
