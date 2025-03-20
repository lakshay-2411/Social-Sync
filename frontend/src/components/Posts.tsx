import { useSelector } from "react-redux";
import Post from "./Post";
import IPostFrontend from "@/interfaces/postInterface";

const Posts = () => {
  const posts: IPostFrontend[] = useSelector((state: any) => state.post.posts);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
