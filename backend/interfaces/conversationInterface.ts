import mongoose from "mongoose";

interface IConversation {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

export default IConversation;
