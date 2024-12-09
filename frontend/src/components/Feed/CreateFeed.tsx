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
import { Post } from "@/Pages/Feed";
interface CreateFeedProps {
  path: string;
  onCreateSuccess: (newPost: Post) => void;
}

export default function CreateFeed({ path, onCreateSuccess }: CreateFeedProps) {
  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 mb-4">
          <div className="flex gap-2">
            <Avatar className="w-12 h-12">
              <AvatarImage src={path} />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              className="justify-start w-full text-gray-500"
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
              onCreateSuccess(newPost); // Panggil fungsi dari parent
              setCreateOpen(false);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
