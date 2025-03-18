import mongoose from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  gender?: "male" | "female";
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  savedPosts: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default IUser;
