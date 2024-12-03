import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const CreatePost: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length > 280) {
      setError("Content must not exceed 280 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        "http://localhost:3000/api/feed",
        { content },
        { withCredentials: true }
      );
      setContent("");
      setError("");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const { success, message } = err.response.data;

        if (!success) {
          setError(message || "An error occurred.");
        }
      } else {
        setError("Failed to post");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-10">
      {/* "TODO: padding" */}
      <div className="create-post">
        <form onSubmit={handleSubmit}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a new post..."
            maxLength={280}
            rows={4}
            required
          />
          {error && <p className="error">{error}</p>}
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
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
    </div>
  );
};

export default CreatePost;
