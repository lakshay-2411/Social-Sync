import IPostFrontend from "./postInterface";

interface IUserFrontend {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  gender?: "male" | "female";
  followers: string[];
  following: string[];
  posts?: IPostFrontend[];
  savedPosts: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default IUserFrontend;
