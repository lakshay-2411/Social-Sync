import IcommentFrontend from "./commentInterface";
import IUserFrontend from "./userInterface";

interface IPostFrontend {
  _id: string;
  caption?: string;
  image: string;
  author: IUserFrontend;
  likes: string[];
  comments: IcommentFrontend[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default IPostFrontend;
