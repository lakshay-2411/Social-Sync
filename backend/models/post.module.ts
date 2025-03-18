import mongoose, { mongo } from "mongoose";
import IPost from "../interfaces/postInterface.js";

const postSchema = new mongoose.Schema<IPost>(
  {
    caption: { type: String, default: "" },
    image: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
