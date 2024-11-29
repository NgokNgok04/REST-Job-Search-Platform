import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import axios from "axios";
import client from "@/utils/axiosClient";
import { DialogTitle } from "@radix-ui/react-dialog";

const formSchema = z.object({
  skill: z.string().min(1),
});
interface AddSkillsProps {
  data: string;
  logo: string;
}

export default function AddSkills({ data, logo }: AddSkillsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skill: "",
    },
  });

  async function handleSkills(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      const result = `${data ? data + "{$}" + values.skill : values.skill}`;
      const profileData = {
        skills: result,
      };
      const response = await client.put(window.location.pathname, profileData);
      if (response.status != 200) {
        console.log("SALAH bang");
      } else {
        console.log("BERHASIL BOS");
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
            <img src={logo} width={20} alt="act logo" />
          </button>
        </DialogTrigger>
      </div>
      <DialogTitle></DialogTitle>
      <DialogDescription />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <Form {...form}>
            <form
              className="space-y-8"
              onSubmit={form.handleSubmit(handleSkills)}
            >
              <FormField
                control={form.control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your new skill" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  className="flex justify-end bg-[#0A66C2] rounded-full"
                >
                  Save Skill
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
