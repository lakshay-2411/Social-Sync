import IPost from "../../../backend/interfaces/postInterface";
import IUser from "../../../backend/interfaces/userInterface";

interface IPostFrontend extends Omit<IPost, "author" | "likes" | "comments"> {
  _id: string;
  author: IUser;
  likes: string[];
  comments: string[];
}

export default IPostFrontend;
