import React, {
  Suspense,
  use,
  useActionState,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { LikeData, getLikes, likePost } from "./likes";

function App() {
  return (
    <>
      <h1>React 19 Beta playground</h1>
      <h2>useOptimistic + useTransition</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Optimistic />
      </Suspense>
      <h2>useOptimistic + useActionState</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <ActionState />
      </Suspense>
    </>
  );
}

const Post: React.FC<{
  likes: LikeData;
  isPending: boolean;
  like: () => void;
}> = ({ likes: { liked, likes }, isPending, like }) => {
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

const Optimistic: React.FC = () => {
  const [serverData, setLikes] = useState(use(getLikes()));
  const [displayData, addOptimisticLike] = useOptimistic(
    serverData,
    (state, nextLiked: boolean) => {
      return { liked: nextLiked, likes: state.likes + (nextLiked ? 1 : -1) };
    }
  );
  const [isPending, startTransition] = useTransition();
  const like = () => {
    startTransition(async () => {
      addOptimisticLike(!displayData.liked);
      const newData = await likePost();
      setLikes(newData);
    });
  };

  return <Post likes={displayData} isPending={isPending} like={like} />;
};

const ActionState: React.FC = () => {
  const [serverData, runAction, isPending] = useActionState(async () => {
    addOptimisticLike(!displayData.liked);
    const result = await likePost();
    return result;
  }, use(getLikes()));
  const [displayData, addOptimisticLike] = useOptimistic(
    serverData,
    (state, nextLiked: boolean) => {
      return { liked: nextLiked, likes: state.likes + (nextLiked ? 1 : -1) };
    }
  );
  const like = () => {
    runAction();
  };
  return <Post likes={displayData} isPending={isPending} like={like} />;
};

export default App;
