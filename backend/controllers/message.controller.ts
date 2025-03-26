import { Request, Response } from "express";
import Conversation from "../models/conversation.module.js";
import Message from "../models/message.module.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

interface CustomRequest extends Request {
  file?: Express.Multer.File;
  id?: string;
}

// For chatting with other users
export const sendMessage = async (req: CustomRequest, res: Response) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ message: "Message is required", success: false });
      return;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await Promise.all([conversation.save(), newMessage.save()]);
    }

    // Implement socket.io for real-time chatting
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ newMessage, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const getMessage = async (req: CustomRequest, res: Response) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages")

    if (!conversation) {
      res.status(200).json({ messages: [], success: true });
      return;
    }

    res.status(200).json({ messages: conversation?.messages, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};
