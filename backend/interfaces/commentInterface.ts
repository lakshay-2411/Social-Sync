import mongoose from "mongoose";

interface IComment {
  text: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IComment;
