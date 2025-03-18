import mongoose from "mongoose";

interface IPost {
  caption?: string;
  image: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default IPost;
