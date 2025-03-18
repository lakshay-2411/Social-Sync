import mongoose from "mongoose";
import IConversation from "../interfaces/conversationInterface.js";

const conversationSchema = new mongoose.Schema<IConversation>({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
