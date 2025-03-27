import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUserFrontend from "@/interfaces/userInterface";

interface AuthState {
  user: IUserFrontend | null;
  suggestedUsers: IUserFrontend[];
  userProfile: IUserFrontend | null;
  selectedUser: IUserFrontend | null;
}

const initialState: AuthState = {
  user: null,
  suggestedUsers: [],
  userProfile: null,
  selectedUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action: PayloadAction<IUserFrontend[]>) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<IUserFrontend | null>) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<IUserFrontend | null>) => {
      state.selectedUser = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
} = authSlice.actions;
export default authSlice.reducer;
