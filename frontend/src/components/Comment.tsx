import IcommentFrontend from "@/interfaces/commentInterface";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Comment: React.FC<{ comment: IcommentFrontend }> = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} alt="avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="font-semibold text-md">
          {comment?.author?.username} <span className="font-normal pl-1">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
