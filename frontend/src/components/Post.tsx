import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import React, { useState } from "react";
import IPostFrontend from "@/interfaces/postInterface";

interface PostProps {
  post: IPostFrontend;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [text, setText] = useState("");

  const [showDialog, setShowDialog] = useState(false);

  const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
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
          <h1>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favourites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Delete
            </Button>
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
          <FaRegHeart
            className="cursor-pointer hover:text-gray-600"
            size={"22px"}
          />
          <MessageCircle
            className="cursor-pointer hover:text-gray-600"
            onClick={() => setShowDialog(true)}
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium text-sm block mb-2">
        {post.likes.length} likes
      </span>
      <p className="text-sm">
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      <span
        className="cursor-pointer text-sm text-gray-600"
        onClick={() => setShowDialog(true)}
      >
        View all {post.comments.length} comments
      </span>
      <CommentDialog showDialog={showDialog} setShowDialog={setShowDialog} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add comment..."
          value={text}
          onChange={handleComment}
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#3BADF8]">Post</span>}
      </div>
    </div>
  );
};

export default Post;
