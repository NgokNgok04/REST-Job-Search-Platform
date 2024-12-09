import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreatePost from "./CreatePost";
import { Post } from "@/Pages/Feeds";
interface CreateFeedProps {
  path: string;
}
export default function CreateFeed({ path }: CreateFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false);

  const handleCreatePostSuccess = (newPost: Post) => {
    console.log("Handle");
    setCreateOpen(false);
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Tambahkan post baru di awal
  };
  console.log(posts);

  return (
    <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 mb-4">
          <div className="flex gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={path} />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              className="w-full justify-start text-gray-500"
            >
              Start a post
            </Button>
          </div>
        </Card>
      </DialogTrigger>
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
  );
}
