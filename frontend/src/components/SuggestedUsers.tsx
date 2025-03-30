import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Types } from "mongoose";
import { useState } from "react";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const [followingStatus, setFollowingStatus] = useState<{
    [key: string]: boolean;
  }>(
    () =>
      user?.following?.reduce((acc, id) => {
        acc[id.toString()] = true;
        return acc;
      }, {} as { [key: string]: boolean }) || {}
  );

  const handleFollow = async (userId: Types.ObjectId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/followorunfollow/${userId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setFollowingStatus((prev) => ({
          ...prev,
          [userId.toString()]: !prev[userId.toString()],
        }));
        toast.success(res.data.message);
        if (user) {
          const updatedAuthUser = {
            ...user,
            following: res.data.message.includes("Followed")
              ? [...user?.following, userId]
              : user?.following.filter((id) => id !== userId.toString()),
          };
          dispatch(setAuthUser(updatedAuthUser));
        }
      } else {
        setFollowingStatus((prev) => ({
          ...prev,
          [userId.toString()]: !prev[userId.toString()],
        }));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center gap-20 justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        const isFollowing = followingStatus[user?._id.toString()] || false;
        return (
          <div
            key={user._id.toString()}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <span
              onClick={() => handleFollow(new Types.ObjectId(user?._id))}
              className={`text-xs font-bold cursor-pointer ${
                isFollowing
                  ? "text-red-500 hover:text-red-400"
                  : "text-[#3BADF8] hover:text-[#3495d6]"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
