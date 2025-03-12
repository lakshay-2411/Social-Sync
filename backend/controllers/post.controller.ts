import { Request, Response } from "express";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.module.js";
import User from "../models/user.module.js";
import Comment from "../models/comment.module.js";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  file?: Express.Multer.File;
  id?: string;
}

export const addNewPost = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { caption }: { caption: string } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      res.status(400).json({ message: "Image is required", success: false });
      return;
    }

    // Save the post to the database
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // Buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    res.status(201).json({ message: "Post created", post, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        populate: { path: "author", select: "username profilePicture" },
      })
      .exec();
    // ✅ Sort comments manually since `populate` does not support sorting
    posts.forEach((post) => {
      (post.comments as any[]).sort(
        (a, b) => (b as any).createdAt - (a as any).createdAt
      );
    });

    if (posts.length === 0) {
      res.status(404).json({ message: "No posts found", success: false });
      return;
    }

    res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const getUserPost = async (req: CustomRequest, res: Response) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        populate: { path: "author", select: "username profilePicture" },
      })
      .exec();
    // ✅ Sort comments manually since `populate` does not support sorting
    posts.forEach((post) => {
      (post.comments as any[]).sort(
        (a, b) => (b as any).createdAt - (a as any).createdAt
      );
    });

    if (posts.length === 0) {
      res.status(404).json({ message: "No posts found", success: false });
      return;
    }

    res.status(200).json({ posts, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const likePost = async (req: CustomRequest, res: Response) => {
  try {
    const userLikingThePost = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }

    // Like logic started
    await post.updateOne({ $addToSet: { likes: userLikingThePost } });
    await post.save();

    // implement socket io for real time notification

    res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const unlikePost = async (req: CustomRequest, res: Response) => {
  try {
    const userUnlikingThePost = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }

    await post.updateOne({ $pull: { likes: userUnlikingThePost } });
    await post.save();

    // implement socket io for real time notification

    res.status(200).json({ message: "Post Disliked", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const addComment = async (req: CustomRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const userCommenting = req.id;

    const { text }: { text: string } = req.body;
    const post = await Post.findById(postId);

    if (!text) {
      res.status(400).json({ message: "Text is required", success: false });
    }

    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }
    const comment = await (
      await Comment.create({
        text,
        author: userCommenting,
        post: postId,
      })
    ).populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: "Comment added", comment, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const getCommentsOfPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (comments.length === 0) {
      res
        .status(404)
        .json({ message: "No comments found for this post", success: false });
      return;
    }

    res.status(200).json({ comments, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const deletePost = async (req: CustomRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }

    // check if the logged in user is the author of the post
    if (post.author.toString() !== authorId) {
      res.status(403).json({
        message: "You are not authorized to delete this post",
        success: false,
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Delete the post from the user's post array
    let user = await User.findById(authorId);
    if (user) {
      user.posts = user.posts.filter((post) => post.toString() !== postId);
      await user.save();
    }

    // Delete all comments of the post
    await Comment.deleteMany({ post: postId });

    res.status(200).json({ message: "Post deleted", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const savePost = async (req: CustomRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found", success: false });
      return;
    }

    const user = await User.findById(authorId);
    if (!user) {
      res.status(404).json({ message: "User not found", success: false });
      return;
    }

    // Save the post to the user's saved post array
    if (user.savedPosts.includes(post._id)) {
      // Already saved. So remove it
      await user.updateOne({ $pull: { savedPosts: post._id } });
      await user.save();
      res
        .status(200)
        .json({ type: "unsaved", message: "Post unsaved", success: true });
    } else {
      await user.updateOne({ $addToSet: { savedPosts: post._id } });
      await user.save();
      res
        .status(200)
        .json({ type: "saved", message: "Post saved", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};
