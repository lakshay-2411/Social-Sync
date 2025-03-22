import mongoose from "mongoose";

interface IConversation {
  _id: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

export default IConversation;
