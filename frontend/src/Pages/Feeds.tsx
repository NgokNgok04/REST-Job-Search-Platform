import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreatePost from "@/components/Feed/CreatePost";
import EditPost from "@/components/Feed/UpdatePost";
import DeletePost from "@/components/Feed/DeletePost";

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

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

  const handleCreatePostSuccess = (newPost: Post) => {
    console.log("Handle");
    setCreateOpen(false);
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Tambahkan post baru di awal
  };

  const handleUpdatePostSuccess = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id
          ? {
              ...post,
              content: updatedPost.content,
              updated_at: updatedPost.updated_at,
            }
          : post
      )
    );
    setEditPostId(null); 
  };

  const handleDeletePostSuccess = () => {
    setDeletePostId(null);
    setPosts(
      (prevPosts) => prevPosts.filter((post) => post.id !== deletePostId) // Hapus post berdasarkan id
    );
  };

  return (
    <div className="feed-page">
      {/* Open Create modal */}
      <Button onClick={() => setCreateOpen(true)}>Create Post</Button>

      {/* Posts */}
      <div>
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            <p>{post.content}</p>
            <div className="flex mt-2 space-x-2 post-actions">
              <Button
                variant="secondary"
                onClick={() => setEditPostId(post.id)}
              >
                Update
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeletePostId(post.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {loading && <p>Loading...</p>}
        {!hasMore && <p>No more posts to load.</p>}
      </div>

      {/* Create Post Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <CreatePost
            onClose={(newPost) => {
              if (newPost) {
                handleCreatePostSuccess(newPost);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      {editPostId && (
        <Dialog open={!!editPostId} onOpenChange={() => setEditPostId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <EditPost
              postId={editPostId}
              onClose={(updatedPost) => {
                if (updatedPost) {
                  handleUpdatePostSuccess(updatedPost);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Post Modal */}
      {deletePostId && (
        <Dialog
          open={!!deletePostId}
          onOpenChange={() => setDeletePostId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to delete this post?
            </DialogDescription>
            <DialogFooter>
              <DeletePost
                postId={deletePostId}
                onClose={handleDeletePostSuccess}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FeedPage;
