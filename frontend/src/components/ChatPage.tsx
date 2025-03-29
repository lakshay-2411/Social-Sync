import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import { useEffect, useState } from "react";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import useTypingIndicator from "@/hooks/useTypingIndicator";

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [message, setMessage] = useState("");
  const { onlineUsers, messages } = useSelector((state: any) => state.chat);
  const dispatch = useDispatch();
  const { sendTypingStatus } = useTypingIndicator();
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const { typingUsers } = useTypingIndicator();
  const isTyping =
    selectedUser && typingUsers.includes(selectedUser?._id.toString());

  const sendMessageHandler = async (receiverId: string) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setMessage("");
        sendTypingStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMessage(inputValue);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    sendTypingStatus(inputValue.length > 0);
    // Set a timeout to stop typing after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      sendTypingStatus(false);
    }, 3000);

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            const isUserTyping = typingUsers.includes(
              suggestedUser?._id.toString()
            );
            return (
              <div
                key={suggestedUser?._id.toString()}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="suggestedUserImage"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isUserTyping
                        ? "text-blue-500 animate-pulse"
                        : isOnline
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isUserTyping
                      ? "Typing..."
                      : isOnline
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-b-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage
                src={selectedUser?.profilePicture}
                alt="profileImage"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
              {isTyping && (
                <span className="text-sm text-blue-500 animate-pulse">
                  Typing...
                </span>
              )}
            </div>
          </div>
          <Messages />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              type="text"
              value={message}
              onChange={handleMessageChange}
              onBlur={() => sendTypingStatus(false)}
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Type a message"
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id.toString())}
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium text-xl">Your Messages</h1>
          <span>Send a message to start chatting.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
