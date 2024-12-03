import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface EditPostProps {
  postId: string;
  onClose: () => void;
}

const EditPost: React.FC<EditPostProps> = ({ postId, onClose }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/feed/${postId}`, {
          withCredentials: true,
        });
        setContent(response.data.content);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch post.";
        setError(errorMessage);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed.length > 280) {
      setError("Content must be 280 characters or less.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(
        `http://localhost:3000/api/feed/${postId}`,
        { trimmed },
        { withCredentials: true }
      );
      // Optionally, you can trigger a refetch of the feed here
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-post">
      <form onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Edit your post..."
          maxLength={280}
          rows={4}
          required
        />
        {error && <p className="error">{error}</p>}
        <div className="flex justify-end mt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="ml-2"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
