import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { RootState } from "@/redux/store";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import SkeletonProfile from "./SkeletonProfile";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const Profile = () => {
  const params = useParams();
  const loading = useGetUserProfile(params.id || "");
  const [activeTab, setActiveTab] = useState("POSTS");
  const { userProfile, user } = useSelector((state: RootState) => state.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.some(
    (id) => id.toString() === userProfile?._id.toString()
  );
  const dispatch = useDispatch();

  const postsToDisplay =
    activeTab === "POSTS" ? userProfile?.posts : userProfile?.savedPosts;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleFollow = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (user) {
          const updatedAuthUser = {
            ...user,
            following: res.data.message.includes("Followed")
              ? [...user?.following, userProfile?._id]
              : user?.following.filter((id) => id !== userProfile?._id),
          };
          dispatch(setAuthUser(updatedAuthUser));
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return loading ? (
    <SkeletonProfile />
  ) : (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-10 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="w-32 h-34">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilePicture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant={"secondary"}
                        className="cursor-pointer hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant={"secondary"}
                      className="cursor-pointer hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant={"secondary"}
                      className="cursor-pointer hover:bg-gray-200 h-8"
                    >
                      Add Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      onClick={handleFollow}
                      variant={"secondary"}
                      className="cursor-pointer hover:bg-gray-300 h-8"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant={"secondary"}
                      className="cursor-pointer hover:bg-gray-300 h-8"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleFollow}
                    className="cursor-pointer bg-[#0095F6] hover:bg-[#0094f6cb] h-8"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-6">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts?.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1 text-[14px]">
                <span className="font-semibold">
                  {userProfile?.bio || "Bio here..."}
                </span>
                <Badge variant={"secondary"} className="w-fit">
                  <AtSign />
                  <span>{userProfile?.username}</span>
                </Badge>
                <span>Learn code with Lakshay!😎</span>
                <span>Turning code into fun!😎</span>
                <span>DM for more.😎</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              onClick={() => handleTabChange("POSTS")}
              className={`py-3 cursor-pointer ${
                activeTab === "POSTS" && "font-bold"
              }`}
            >
              POSTS
            </span>
            <span
              onClick={() => handleTabChange("SAVED")}
              className={`py-3 cursor-pointer ${
                activeTab === "SAVED" && "font-bold"
              }`}
            >
              SAVED
            </span>
            <span
              onClick={() => handleTabChange("REELS")}
              className={`py-3 cursor-pointer ${
                activeTab === "REELS" && "font-bold"
              }`}
            >
              REELS
            </span>
            <span
              onClick={() => handleTabChange("TAGS")}
              className={`py-3 cursor-pointer ${
                activeTab === "TAGS" && "font-bold"
              }`}
            >
              TAGS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {postsToDisplay?.map((post) => {
              if (typeof post === "object" && "image" in post) {
                return (
                  <div
                    key={post._id.toString()}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={post?.image}
                      alt="postimage"
                      className="rounded-sm my-2 w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center text-white space-x-4">
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
