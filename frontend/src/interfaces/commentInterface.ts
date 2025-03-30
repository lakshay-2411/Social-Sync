import IUserFrontend from "./userInterface";

interface IcommentFrontend {
  _id: string;
  text: string;
  author: IUserFrontend;
  post: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IcommentFrontend;
