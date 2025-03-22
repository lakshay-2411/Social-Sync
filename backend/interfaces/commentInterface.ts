import mongoose from "mongoose";

interface IComment {
  _id: mongoose.Types.ObjectId;
  text: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IComment;
