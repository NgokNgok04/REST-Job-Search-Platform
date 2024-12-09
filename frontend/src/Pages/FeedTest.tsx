// import CreateFeed from "@/components/Feed/CreateFeed";
import { UserAPI } from "@/api/user-api";
import CreateFeed from "@/components/Feed/CreateFeed";
// import FeedCard from "@/components/Feed/FeedCard";
import PersonCard from "@/components/PersonCard";
// import { Button } from "@/components/ui/button";
import axios from "axios";
// import { useAuth } from "@/contexts/authContext";
import { useEffect, useRef, useState } from "react";
import { Post } from "./Feeds";
import FeedCard from "@/components/Feed/FeedCard";

type userDataProps = {
  username: string;
  id: number;
  name: string;
  profile_photo: string;
};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [userData, setUserData] = useState<userDataProps>({
    username: "Anonim",
    id: 0,
    name: "Anonim",
    profile_photo: "/store/profile.png",
  });

  useEffect(() => {
    try {
      async function getDataSelf() {
        const response = await UserAPI.getSelf();
        console.log(response);
        setUserData(response);
      }
      getDataSelf();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      fetchPosts();
      hasFetched.current = true;
    }
  }, []);

  const lastPostRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts();
      }
    });

    if (lastPostRef.current) observer.current.observe(lastPostRef.current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [cursor, hasMore]);

  const fetchPosts = async () => {
    console.log("loading: ", loading, "hasmore: ", hasMore);
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/feed?cursor=${cursor}&limit=10`,
        { withCredentials: true }
      );

      const { posts: newPosts, nextCursor } = response.data.body;

      setPosts((prev) => [...prev, ...newPosts]);
      setCursor(nextCursor);
      setHasMore(nextCursor !== null);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto pt-4 px-4 grid grid-cols-12 gap-4">
        <PersonCard
          name={userData.username}
          isFeedPage={true}
          path={`${import.meta.env.VITE_API_URL}${userData.profile_photo}`}
        />
        <div className="col-span-6">
          <CreateFeed
            path={`${import.meta.env.VITE_API_URL}${userData.profile_photo}`}
          />
          <div className="flex flex-col gap-2">
            {posts.map((post, index) => (
              <FeedCard
                key={post.id}
                ref={index === posts.length - 1 ? lastPostRef : null}
                name="Matthew"
                path={`${import.meta.env.VITE_API_URL}/store/profile.png`}
                content={post.content}
                isOwner={true}
              />
              // <div
              //   key={post.id}
              //   ref={index === posts.length - 1 ? lastPostRef : null}
              // >
              //   <p>{post.content}</p>
              //   <div className="flex mt-2 space-x-2 post-actions">
              //     <Button
              //       variant="secondary"
              //       //   onClick={() => setEditPostId(post.id)}
              //     >
              //       Update
              //     </Button>
              //     <Button
              //       variant="destructive"
              //       //   onClick={() => setDeletePostId(post.id)}
              //     >
              //       Delete
              //     </Button>
              //   </div>
              // </div>
            ))}
            {loading && <p>Loading...</p>}
            {!hasMore && <p>No more posts to load.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
