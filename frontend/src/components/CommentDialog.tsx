import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import IPostFrontend from "@/interfaces/postInterface";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { setPost } from "@/redux/postSlice";
import { toast } from "sonner";

const CommentDialog: React.FC<{
  showDialog: boolean;
  setShowDialog: (value: boolean) => void;
}> = ({ showDialog, setShowDialog }) => {
  const [text, setText] = useState("");
  const selectedPost: IPostFrontend = useSelector(
    (state: any) => state.post.selectedPost
  );
  const [comment, setComment] = useState<IPostFrontend["comments"]>([]);

  const posts: IPostFrontend[] = useSelector((state: any) => state.post.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    setComment(selectedPost?.comments || []);
  }, [selectedPost]);

  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const postCommentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setComment([...comment, res.data.comment]);

        const updatedPostData = posts.map((postItem) =>
          postItem._id === selectedPost._id
            ? {
                ...postItem,
                comments: [...postItem.comments, res.data.comment],
              }
            : postItem
        );
        dispatch(setPost(updatedPostData));
        setText("");
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
    <Dialog open={showDialog}>
      <DialogContent
        onInteractOutside={() => setShowDialog(false)}
        className="w-full lg:max-w-[600px] xl:max-w-[800px] 2xl:max-w-[1000px] p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="rounded-l-lg w-full h-full aspect-square object-cover"
              src={selectedPost?.image}
              alt="post_image"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link to="">
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs" to="">
                    {selectedPost?.author?.username}
                  </Link>
                  {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favourites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto text-sm max-h-96 p-4">
              {comment.map((comment) => (
                <Comment key={comment._id.toString()} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={text}
                  onChange={handleComment}
                  className="w-full outline-none text-sm border border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={postCommentHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
