import { createSlice } from "@reduxjs/toolkit";
import IPostFrontend from "@/interfaces/postInterface";

interface PostState {
  posts: IPostFrontend[];
  selectedPost: IPostFrontend | null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
  },
});

export const { setPost, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;
