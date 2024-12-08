import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Post } from "@/Pages/Feeds";

interface CreatePostProps {
  onClose: (newPost?: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose }) => {
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/feed",
        { content },
        { withCredentials: true }
      );

      const newPost = response.data.body;
      console.log(newPost);
      onClose(newPost);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create post.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Create a new post..."
          required
        />
        {error && <p>{error}</p>}
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
