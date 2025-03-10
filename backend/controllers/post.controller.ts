import { Request, Response } from "express";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.module.js";
import User from "../models/user.module.js";

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

    

    res.status(201).json({ post, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};
