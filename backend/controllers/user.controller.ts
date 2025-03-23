import { Request, Response } from "express";
import User from "../models/user.module.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import Post from "../models/post.module.js";

interface CustomRequest extends Request {
  file?: Express.Multer.File;
  id?: string;
}

export const Register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as Record<string, string>;

    if (!username || !email || !password) {
      res
        .status(401)
        .json({ message: "All fields are required", success: false });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).json({ message: "Email already exists", success: false });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword });
    res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as Record<string, string>;
    if (!email || !password) {
      res
        .status(401)
        .json({ message: "All fields are required", success: false });
      return;
    }
    let user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res
        .status(401)
        .json({ message: "Invalid credentials entered", success: false });
      return;
    }

    if (!process.env.SECRET_KEY) {
      res.status(500).json({
        message: "Server error: Secret key not found",
        success: false,
      });
      return;
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // populate each postId in the post array
    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post?.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPost,
    };

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user: userData,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const Logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .populate({ path: "posts", options: { sort: { createdAt: -1 } } })
      .populate("savedPosts");
    if (!user) {
      res.status(401).json({ message: "User not found", success: false });
      return;
    }
    res.status(200).json({ user, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const editProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.id;
    const { bio, gender }: { bio?: string; gender?: "male" | "female" } =
      req.body;
    const profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri as string);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse?.secure_url;

    await user.save();
    res
      .status(200)
      .json({ message: "Profile updated successfully", success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const getSuggestedUsers = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      res.status(400).json({ message: "No users found", success: false });
      return;
    }
    res.status(200).json({ users: suggestedUsers, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const followOrUnfollow = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const followKarneWala = req.id; // logged in user
    const jiskoFollowKarunga = req.params.id; // user to follow
    if (followKarneWala === jiskoFollowKarunga) {
      res
        .status(400)
        .json({ message: "You cannot follow yourself", success: false });
      return;
    }
    const user = await User.findById(followKarneWala);
    const targetUser = await User.findById(jiskoFollowKarunga);

    if (!user || !targetUser) {
      res.status(400).json({ message: "User not found", success: false });
      return;
    }
    // Checking whether to follow or unfollow
    const isFollowing = user.following.includes(
      new mongoose.Types.ObjectId(jiskoFollowKarunga)
    );
    if (isFollowing) {
      // Unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $pull: { following: jiskoFollowKarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $pull: { followers: followKarneWala } }
        ),
      ]);
      res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      // Follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarneWala },
          { $push: { following: jiskoFollowKarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $push: { followers: followKarneWala } }
        ),
      ]);
      res.status(200).json({ message: "Followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};
