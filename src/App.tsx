import React, {
  Suspense,
  use,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { getLikes, likePost } from "./likes";

function App() {
  return (
    <>
      <h1>React 19 Beta playground</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Post />
      </Suspense>
    </>
  );
}

const Post: React.FC = () => {
  const [serverData, setLikes] = useState(use(getLikes()));
  const [{ liked, likes }, addOptimisticLike] = useOptimistic(
    serverData,
    (state, nextLiked: boolean) => {
      return { liked: nextLiked, likes: state.likes + (nextLiked ? 1 : -1) };
    }
  );
  const [isPending, startTransition] = useTransition();
  const like = () => {
    startTransition(async () => {
      addOptimisticLike(!liked);
      const newData = await likePost();
      setLikes(newData);
    });
  };

  return (
    <div className="card">
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <div>
        <span>何か良い感じの投稿</span>
        <button
          className="likes"
          data-liked={liked}
          data-pending={isPending}
          onClick={() => like()}
        >
          ❤ {likes}
        </button>
      </div>
    </div>
  );
};

export default App;
