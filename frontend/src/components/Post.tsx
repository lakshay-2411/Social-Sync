import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import React, { useState } from "react";

const Post = () => {
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
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>Username</h1>
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
        src="https://images.unsplash.com/photo-1740715537042-6de862cdaab4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
      <span className="font-medium text-sm block mb-2">200 likes</span>
      <p className="text-sm">
        <span className="font-medium mr-2">Username</span>
        Caption
      </p>
      <span className="cursor-pointer text-sm text-gray-600" onClick={() => setShowDialog(true)}>
        View all 10 comments
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
