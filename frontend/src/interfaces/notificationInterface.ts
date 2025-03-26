import IUserFrontend from "@/interfaces/userInterface";

interface INotification {
  type: "like" | "unlike";
  userId: string;
  userDetails: IUserFrontend;
  postId: string;
  message: string;
}

export default INotification;
