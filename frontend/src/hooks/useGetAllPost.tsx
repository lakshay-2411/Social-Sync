import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/post/all`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          console.log(res.data);

          dispatch(setPost(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};

export default useGetAllPost;
