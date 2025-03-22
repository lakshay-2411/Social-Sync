import IComment from "../../../backend/interfaces/commentInterface";
import IUser from "../../../backend/interfaces/userInterface";

interface IcommentFrontend extends Omit<IComment, "author"> {
  author: IUser;
}

export default IcommentFrontend;