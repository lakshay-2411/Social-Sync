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

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female"] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
