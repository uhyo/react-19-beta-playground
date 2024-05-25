export type LikeData = {
  liked: boolean;
  likes: number;
};

const likes: LikeData = {
  liked: false,
  likes: 0,
};

setInterval(() => {
  if (Math.random() < 0.3) {
    likes.likes++;
  }
}, 100);

const errorProbability = 0.8;

let likesCachePromise: Promise<LikeData> | undefined;

export function getLikes(): Promise<LikeData> {
  likesCachePromise ??= (async () => {
    await sleep(500);
    return structuredClone(likes);
  })();
  return likesCachePromise;
}

function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export async function likePost(): Promise<LikeData> {
  console.log("[api] liking...");
  await sleep(1500);
  if (Math.random() < errorProbability) {
    console.log("[api] failure");
    throw new Error("Failed to like post");
  }
  if (likes.liked) {
    likes.likes--;
  } else {
    likes.likes++;
  }
  likes.liked = !likes.liked;
  console.log("[api] success");
  return structuredClone(likes);
}
