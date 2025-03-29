import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useTypingIndicator = () => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { user, selectedUser } = useSelector((state: RootState) => state.auth);
  const { socket } = useSelector((state: RootState) => state.socketio);

  const sendTypingStatus = (typing: boolean) => {
    if (socket && selectedUser) {
      socket.emit("typing", {
        senderId: user?._id,
        receiverId: selectedUser?._id,
        isTyping: typing,
      });
    }
  };

  useEffect(() => {
    const handleUserTyping = (data: {
      senderId: string;
      isTyping: boolean;
    }) => {
      if (data.senderId === selectedUser?._id.toString()) {
        setTypingUsers((prev) => {
          const alreadyTyping = prev.includes(data.senderId);
          if (data.isTyping) {
            return alreadyTyping ? prev : [...prev, data.senderId];
          } else {
            return prev.filter((id) => id !== data.senderId);
          }
        });
      }
    };

    if (socket) {
      socket.on("userTyping", handleUserTyping);
    }

    return () => {
      if (socket) {
        socket.off("userTyping", handleUserTyping);
      }
    };
  }, [socket, selectedUser]);

  return { sendTypingStatus, typingUsers };
};

export default useTypingIndicator;
