import IUser from "../../../backend/interfaces/userInterface";
import IPostFrontend from "./postInterface";

interface IUserFrontend extends Omit<IUser, "posts"> {
  posts?: IPostFrontend[];
}

export default IUserFrontend;
