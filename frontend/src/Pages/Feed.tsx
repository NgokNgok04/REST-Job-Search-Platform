import { UserAPI } from "@/api/user-api";
import CreateFeed from "@/components/Feed/CreateFeed";
import PersonCard from "@/components/PersonCard";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import FeedCard from "@/components/Feed/FeedCard";

type userDataProps = {
  username: string;
  id: number;
  name: string;
  profile_photo: string;
};

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Feeds {
  post: {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
    full_name: string;
    profile_photo_path: string;
  };
  isOwner: boolean;
}

export default function Feed() {
  const [posts, setPosts] = useState<Feeds[]>([]);
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

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      fetchPosts();
      hasFetched.current = true;
    }
  }, []);

  const fetchPoster = async (newPost: Post) => {
    try {
      const user = await UserAPI.getSelf();
      const apalah: Feeds = {
        post: newPost,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name || "",
          profile_photo_path: user.profile_photo_path,
        },
        isOwner: true,
      };

      console.log("Handle");
      setPosts((prevPosts) => [apalah, ...prevPosts]);
    } catch (error) {
      console.error("Failed to handle post creation:", error);
    }
  };

  const handleCreatePostSuccess = (newPost: Post) => {
    fetchPoster(newPost);
  };

  const handleUpdatePostSuccess = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post.id === updatedPost.id
          ? {
              ...post,
              post: {
                ...post.post,
                content: updatedPost.content,
                updated_at: updatedPost.updated_at,
              },
            }
          : post
      )
    );
  };

  const handleDeletePostSuccess = (deletedPostId: string) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.post.id !== deletedPostId)
    );
  };

  return (
    <div className="min-h-screen">
      <div className="grid max-w-6xl grid-cols-12 gap-4 px-4 pt-4 mx-auto">
        <PersonCard
          name={userData.username}
          isFeedPage={true}
          path={`${import.meta.env.VITE_API_URL}${userData.profile_photo}`}
        />
        <div className="col-span-6">
          <CreateFeed
            onCreateSuccess={handleCreatePostSuccess}
            path={`${import.meta.env.VITE_API_URL}${userData.profile_photo}`}
          />
          <div className="flex flex-col gap-2">
            {posts.map((post, index) => (
              <div
                key={post.post.id}
                ref={index === posts.length - 1 ? lastPostRef : null}
              >
                <FeedCard
                  handleDeletePostSuccess={handleDeletePostSuccess}
                  handleUpdatePostSuccess={handleUpdatePostSuccess}
                  id={post.post.id}
                  created_at={post.post.created_at}
                  name={post.user.username}
                  path={`${import.meta.env.VITE_API_URL}/store/profile.png`}
                  content={post.post.content}
                  isOwner={post.isOwner}
                />
              </div>
            ))}
            {loading && <p>Loading...</p>}
            {!hasMore && <p>No more posts to load.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
