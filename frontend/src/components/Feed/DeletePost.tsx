import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";

interface DeletePostProps {
  postId: string;
  onClose: () => void;
}

const DeletePost: React.FC<DeletePostProps> = ({ postId, onClose }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:3000/api/feed/${postId}`, {
        withCredentials: true,
      });

    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delte post.";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-post">
      {error && <p className="error">{error}</p>}
      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={handleDelete} disabled={isDeleting} className="ml-2">
          {isDeleting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default DeletePost;
