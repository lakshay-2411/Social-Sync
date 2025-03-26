import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAuthUser, setSelectedUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPost, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector(
    (state: RootState) => state.realTimeNotification
  );
  const dispatch = useDispatch();
  const [createPostModal, setCreatePostModal] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setSelectedUser(null));
        dispatch(setPost([]));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const sidebarHandler = (textType: string) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setCreatePostModal(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-4 pl-3 font-bold text-xl">LOGO</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center space-x-2 relative text-sm hover:bg-gray-100 cursor-pointer rounder-lg p-3 my-2"
              >
                {item.icon}
                <span>{item.text}</span>
                {item.text === "Notifications" && notifications.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size={"icon"}
                        className="rounded-full w-5 h-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                      >
                        {notifications.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="bg-white p-2 rounded-lg shadow-lg">
                        {notifications.length === 0 ? (
                          <p>No new notifications</p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.userId}
                              className="flex items-center space-x-2 my-2"
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={
                                    notification?.userDetails?.profilePicture
                                  }
                                  alt={notification?.userDetails?.username}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <p className="text-sm">
                                <span className="font-bold">
                                  {notification.userDetails.username}
                                </span>{" "}
                                liked your post
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost
        createPostModal={createPostModal}
        setCreatePostModal={setCreatePostModal}
      />
    </div>
  );
};

export default LeftSideBar;
