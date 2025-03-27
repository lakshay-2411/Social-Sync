import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import React, { useState } from "react";
import IPostFrontend from "@/interfaces/postInterface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import { setPost, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface PostProps {
  post: IPostFrontend;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [text, setText] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const posts: IPostFrontend[] = useSelector((state: any) => state.post.posts);
  const [isLiked, setIsLiked] = useState(
    (user && post.likes.includes(user._id.toString())) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrUnlikePostHandler = async () => {
    try {
      const action = isLiked ? "unlike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
        setLikeCount(updatedLikeCount);
        setIsLiked(!isLiked);

        const updatedPostData = posts.map((postItem) =>
          postItem._id === post._id
            ? {
                ...postItem,
                likes: isLiked
                  ? postItem.likes.filter((id) => id !== user?._id.toString())
                  : [...postItem.likes, user?._id],
              }
            : postItem
        );
        dispatch(setPost(updatedPostData));
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

  const postCommentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
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
          postItem._id === post._id
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

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPost(updatedPostData));
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

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/save`,
        { withCredentials: true }
      );
      if (res.data.success) {
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
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post?.author?._id}`}>
              <h1>{post.author?.username}</h1>
            </Link>
            {user?._id === post?.author?._id && (
              <Badge variant={"secondary"}>Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favourites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_image"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-2">
          {isLiked ? (
            <FaHeart
              onClick={likeOrUnlikePostHandler}
              className="cursor-pointer text-red-600"
              size={"24px"}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrUnlikePostHandler}
              className="cursor-pointer hover:text-gray-600"
              size={"22px"}
            />
          )}
          <MessageCircle
            className="cursor-pointer hover:text-gray-600"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setShowDialog(true);
            }}
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          className="cursor-pointer hover:text-gray-600"
          onClick={bookmarkHandler}
        />
      </div>
      <span className="font-medium text-sm block mb-2">{likeCount} likes</span>
      <p className="text-sm">
        <Link to={`/profile/${post?.author?._id}`}>
          <span className="font-medium mr-2">{post.author?.username}</span>
        </Link>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          className="cursor-pointer text-sm text-gray-600"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setShowDialog(true);
          }}
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDialog showDialog={showDialog} setShowDialog={setShowDialog} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add comment..."
          value={text}
          onChange={handleComment}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={postCommentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
