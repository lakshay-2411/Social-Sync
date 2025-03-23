import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUserFrontend from "@/interfaces/userInterface";

interface AuthState {
  user: IUserFrontend | null;
  suggestedUsers: IUserFrontend[];
  userProfile: IUserFrontend | null;
}

const initialState: AuthState = {
  user: null,
  suggestedUsers: [],
  userProfile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<IUserFrontend | null>) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action: PayloadAction<IUserFrontend[]>) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<IUserFrontend | null>) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setAuthUser, setSuggestedUsers, setUserProfile } =
  authSlice.actions;
export default authSlice.reducer;
