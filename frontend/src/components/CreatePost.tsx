import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setPost } from "@/redux/postSlice";
import IPostFrontend from "@/interfaces/postInterface";

const CreatePost: React.FC<{
  createPostModal: boolean;
  setCreatePostModal: (value: boolean) => void;
}> = ({ createPostModal, setCreatePostModal }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const posts: IPostFrontend[] = useSelector((state: any) => state.post.posts);
  const dispatch = useDispatch();

  const fileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (postImage) {
      formData.append("image", postImage);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPost([res.data.post, ...posts]));
        toast.success(res.data.message);
        setCreatePostModal(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={createPostModal}>
      <DialogContent onInteractOutside={() => setCreatePostModal(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="create_post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write caption..."
        />
        {imagePreview && (
          <div className="w-full h-45 flex items-center justify-center">
            <img
              className="object-contain h-full w-full rounded-md"
              src={imagePreview}
              alt="post_preview"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          onChange={fileHandler}
          className="hidden"
        />
        <Button
          onClick={() => imageRef.current?.click()}
          className="w-fit mx-auto cursor-pointer bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="w-full"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
