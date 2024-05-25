import React, {
  Suspense,
  use,
  useActionState,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
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
      <h2>useOptimistic + form action</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <FormAction />
      </Suspense>
      <h2>useOptimistic + form action + useActionState</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <FormActionState />
      </Suspense>
      <h2>useOptimistic + form action + useFormStatus</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <FormActionStatus />
      </Suspense>
    </>
  );
}

const Post: React.FC<
  {
    likes: LikeData;
    isPending: boolean;
  } & (
    | {
        buttonType: "submit";
        like?: undefined;
      }
    | {
        buttonType: "button";
        like: () => void;
      }
  )
> = ({ likes: { liked, likes }, isPending, like, buttonType }) => {
  return (
    <div className="card">
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <div>
        <span>何か良い感じの投稿</span>
        <button
          type={buttonType}
          className="likes"
          data-liked={liked}
          data-pending={isPending}
          onClick={buttonType === "button" ? like : undefined}
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

  return (
    <Post
      likes={displayData}
      isPending={isPending}
      buttonType="button"
      like={like}
    />
  );
};

const ActionState: React.FC = () => {
  const [serverData, runAction, isPending] = useActionState(
    async (currentState) => {
      addOptimisticLike(!currentState.liked);
      const result = await likePost();
      return result;
    },
    use(getLikes())
  );
  const [displayData, addOptimisticLike] = useOptimistic(
    serverData,
    (state, nextLiked: boolean) => {
      return { liked: nextLiked, likes: state.likes + (nextLiked ? 1 : -1) };
    }
  );
  const like = () => {
    runAction();
  };
  return (
    <Post
      likes={displayData}
      isPending={isPending}
      buttonType="button"
      like={like}
    />
  );
};

const FormAction: React.FC = () => {
  const [serverData, setLikes] = useState(use(getLikes()));
  const [displayData, addOptimisticLike] = useOptimistic(
    serverData,
    (state, nextLiked: boolean) => {
      return { liked: nextLiked, likes: state.likes + (nextLiked ? 1 : -1) };
    }
  );
  const like = async () => {
    addOptimisticLike(!displayData.liked);
    const newData = await likePost();
    setLikes(newData);
  };

  return (
    <form action={like}>
      <Post likes={displayData} isPending={false} buttonType="submit" />
    </form>
  );
};

const FormActionStatus: React.FC = () => {
  const [serverData, setLikes] = useState(use(getLikes()));
  const [displayData, addOptimisticLike] = useOptimistic(
    serverData,
    (state, nextLiked: boolean) => {
      return { liked: nextLiked, likes: state.likes + (nextLiked ? 1 : -1) };
    }
  );
  const like = async () => {
    addOptimisticLike(!displayData.liked);
    const newData = await likePost();
    setLikes(newData);
  };

  return (
    <form action={like}>
      <FormActionStatusInner likes={displayData} />
    </form>
  );
};

const FormActionStatusInner: React.FC<{ likes: LikeData }> = ({ likes }) => {
  const { pending } = useFormStatus();
  return <Post likes={likes} buttonType="submit" isPending={pending} />;
};

const FormActionState: React.FC = () => {
  const [serverData, like, isPending] = useActionState(async (currentState) => {
    addOptimisticLike(!currentState.liked);
    const newData = await likePost();
    return newData;
  }, use(getLikes()));
  const [displayData, addOptimisticLike] = useOptimistic(
    serverData,
    (state, nextLiked: boolean) => {
      return { liked: nextLiked, likes: state.likes + (nextLiked ? 1 : -1) };
    }
  );

  return (
    <form action={like}>
      <Post likes={displayData} isPending={isPending} buttonType="submit" />
    </form>
  );
};

export default App;
