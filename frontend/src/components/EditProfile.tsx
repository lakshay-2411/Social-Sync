import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const [input, setInput] = useState({
    proFilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  console.log(input);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const genderChangeHandler = (value: string) => {
    if (value === "male") {
      setInput({ ...input, gender: value });
    } else if (value === "female") {
      setInput({ ...input, gender: value });
    }
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    if (input.bio) formData.append("bio", input.bio);
    if (input.gender) formData.append("gender", input.gender);
    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          _id: res.data.user?._id || user?._id,
          username: res.data.user?.username || user?.username,
          email: res.data.user?.email || user?.email,
          password: res.data.user?.password || user?.password,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
          following: res.data.user?.following || [],
          followers: res.data.user?.followers || [],
          savedPosts: res.data.user?.savedPosts || [],
          posts: res.data.user?.posts || [],
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="profileimage" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
          />
          <Button
            onClick={() => imageRef.current?.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#0094f6cb]"
          >
            Change photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={genderChangeHandler}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className="w-fit bg-[#0095F6] h-8 hover:bg-[#0094f6cb]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-[#0095F6] h-8 hover:bg-[#0094f6cb]"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
