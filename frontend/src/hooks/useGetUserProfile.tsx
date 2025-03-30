import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId: string) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        dispatch(setUserProfile(null));
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId, dispatch]);
  return loading;
};

export default useGetUserProfile;
