import mongoose from "mongoose";

interface IMessage {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
}

const messageSchema = new mongoose.Schema<IMessage>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
});

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
