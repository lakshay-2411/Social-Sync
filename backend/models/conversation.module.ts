import mongoose from "mongoose";

interface IConversation {
  participants: mongoose.Types.ObjectId[];
  message: mongoose.Types.ObjectId[];
}

const conversationSchema = new mongoose.Schema<IConversation>({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  message: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
