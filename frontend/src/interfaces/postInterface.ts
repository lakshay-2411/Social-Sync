import IPost from "../../../backend/interfaces/postInterface";
import IUser from "../../../backend/interfaces/userInterface";
import IcommentFrontend from "./commentInterface";

interface IPostFrontend extends Omit<IPost, "author" | "likes" | "comments"> {
  author: IUser;
  likes: string[];
  comments: IcommentFrontend[];
}

export default IPostFrontend;
