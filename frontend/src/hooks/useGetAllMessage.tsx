import { setMessages, setLoadingMessages } from "@/redux/chatSlice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const fetchAllMessage = async () => {
      if (!selectedUser) return;
      dispatch(setLoadingMessages(true));
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/message/all/${selectedUser?._id.toString()}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoadingMessages(false));
      }
    };
    fetchAllMessage();
  }, [selectedUser]);
};

export default useGetAllMessage;
