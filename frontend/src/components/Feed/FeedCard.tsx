import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import editLogo from "/icons/pencil.png";
import trashLogo from "/icons/trash.svg";
import EditPost from "./UpdatePost";
import DeletePost from "./DeletePost";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Post } from "@/Pages/Feed";
interface FeedCardProps {
  id: string;
  name: string;
  content: string;
  path: string;
  isOwner: boolean;
  created_at: string;
  handleUpdatePostSuccess: (updatedPost: Post) => void;
  handleDeletePostSuccess: (deletedPostId: string) => void;
}

export default function FeedCard({
  id,
  name,
  content,
  path,
  isOwner,
  created_at,
  handleUpdatePostSuccess,
  handleDeletePostSuccess,
}: FeedCardProps) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function timeSince(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const difference = now.getTime() - past.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between gap-2">
        <div className="flex flex-row gap-2">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`${import.meta.env.VITE_API_URL}${path}`} />
            <AvatarFallback>Profile</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="flex font-semibold">{name}</h3>
            <p className="text-xs">{timeSince(created_at)}</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex flex-row">
            {/* Edit Post Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
              <DialogTrigger>
                <button className="flex px-2 py-2 rounded-full hover:bg-[#F3F3F3]">
                  <img src={editLogo} width={20} alt="editLogo" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                <EditPost
                  postId={id}
                  onClose={(updatedPost) => {
                    if (updatedPost) {
                      handleUpdatePostSuccess(updatedPost);
                      setEditModalOpen(false); // Tutup modal setelah sukses
                    }
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Delete Post Dialog */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
              <DialogTrigger>
                <button className="flex px-2 py-2 rounded-full hover:bg-[#F3F3F3]">
                  <img src={trashLogo} width={21} alt="trashLogo" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Post</DialogTitle>
                </DialogHeader>
                <DeletePost
                  postId={id}
                  onClose={(success) => {
                    if (success) {
                      handleDeletePostSuccess(id); // Pastikan ID dikirim ke parent
                      setDeleteModalOpen(false); // Tutup modal setelah sukses
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <p className="mt-4 font-extralight">{content}</p>
    </Card>
  );
}
