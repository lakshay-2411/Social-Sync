import { setMessages } from "@/redux/chatSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import IMessage from "../../../backend/interfaces/messageInterface";

const useGetRealTimeMessage = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state: RootState) => state.socketio);
  const { messages } = useSelector((state: RootState) => state.chat);
  useEffect(() => {
    socket?.on("newMessage", (newMessage: IMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages]);
};

export default useGetRealTimeMessage;
