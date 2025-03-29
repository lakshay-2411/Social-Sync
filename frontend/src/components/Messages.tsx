import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRealTimeMessage from "@/hooks/useGetRealTimeMessage";
import useTypingIndicator from "@/hooks/useTypingIndicator";
import { useEffect, useRef } from "react";

const Messages = () => {
  useGetRealTimeMessage();
  useGetAllMessage();
  const { selectedUser } = useSelector((state: RootState) => state.auth);
  const { messages } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { typingUsers } = useTypingIndicator();

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (
      selectedUser?._id &&
      typingUsers.includes(selectedUser._id.toString())
    ) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [typingUsers, selectedUser]);
  return (
    <div className="overflow-y-auto flex-1 p-4 relative">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={selectedUser?.profilePicture}
              alt="profileImage"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button variant={"secondary"} className="h-8 my-2">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg?._id.toString()}
                className={`flex ${
                  msg?.senderId === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg?.senderId === user?._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}

        {selectedUser?._id &&
          typingUsers.includes(selectedUser._id.toString()) && (
            <div
              ref={messageEndRef}
              className="relative p-4 text-sm text-gray-500 animate-pulse"
            >
              {selectedUser?.username} is typing...
            </div>
          )}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

export default Messages;
