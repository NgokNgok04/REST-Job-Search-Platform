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
// import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import client from "@/utils/axiosClient";

const formSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  typeJob: z.enum(["Part-Time", "Full-Time", "Internship"]),
  location: z.string().min(1),
  typeLocation: z.enum(["Hybrid", "Remote", "On-Site"]),
  description: z.string().min(1),
});

interface WorkHistoryProps {
  data: string;
  logo: string;
}
export default function AddWorkHistory({ data, logo }: WorkHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      title: "",
      location: "",
      description: "",
    },
  });

  async function handleAdd(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      const workData = {
        company: values.company,
        title: values.title,
        typeJob: values.typeJob,
        location: values.location,
        typeLocation: values.typeLocation,
        description: values.description,
      };
      const result = `${data ? data + "{$}" : ""}${Object.values(workData).join(
        "{/}"
      )}`;
      const profileData = {
        work_history: result,
      };
      console.log(result);
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
      <DialogDescription />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Work History</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(handleAdd)}>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your job title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeJob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose your location" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your location type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="On-Site">On-Site</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose your description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end">
              <Button
                type="submit"
                className="flex justify-end bg-[#0A66C2] rounded-full"
              >
                Save Work History
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
