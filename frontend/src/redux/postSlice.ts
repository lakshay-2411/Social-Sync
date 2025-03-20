import { createSlice } from "@reduxjs/toolkit";
import IPostFrontend from "@/interfaces/postInterface";

interface PostState {
  posts: IPostFrontend[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { setPost } = postSlice.actions;
export default postSlice.reducer;
