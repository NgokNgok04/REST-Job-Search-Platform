import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  //   DialogDescription,
  //   DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import client from "@/utils/axiosClient";
import editLogo from "/icons/pencil.png";

const formSchema = z.object({
  username: z.string().min(1).max(50),
  fullName: z.string(),
});

interface EditProfileProps {
  fullName: string;
  username: string;
}
export default function EditProfile({ fullName, username }: EditProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: username,
      fullName: fullName,
    },
  });
  async function handleEdit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      const profileData = {
        username: values.username,
        profile_photo_path: undefined,
        fullName: fullName,
        work_history: undefined,
        skills: undefined,
      };
      const response = await client.put(window.location.pathname, profileData);
      if (response.status != 200) {
        console.log("SALAHHH  BOS");
      } else {
        console.log("BERHASIL BOSSS");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.message || "Failed to fetch profile");
      } else if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      setIsOpen(false);
      window.location.reload();
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="w-full flex justify-end">
        <DialogTrigger asChild>
          <button className="flex px-2 py-2 mt-1 mr-1 rounded-full  hover:bg-[#F3F3F3]">
            <img src={editLogo} width={20} alt="editLogo" />
          </button>
        </DialogTrigger>
      </div>
      <DialogDescription />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new username" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new full name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <Button
                type="submit"
                className="flex justify-end bg-[#0A66C2] rounded-full"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
