import mongoose from "mongoose";

interface IComment {
  text: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
}

const commentSchema = new mongoose.Schema<IComment>({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
});

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
