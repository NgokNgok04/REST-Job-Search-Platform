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
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { findIndexWorkData, parseWorkHistory } from "@/utils/parseProfile";
import client from "@/utils/axiosClient";
import { useParams } from "react-router-dom";

const formSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  typeJob: z.enum(["Part-Time", "Full-Time", "Internship"]),
  location: z.string().min(1),
  typeLocation: z.enum(["Hybrid", "Remote", "On-Site"]),
  description: z.string().min(1),
});

interface EditWorkHistoryProps {
  allData: string;
  data: {
    company: string;
    title: string;
    typeJob: string;
    location: string;
    typeLocation: string;
    description: string;
  };
  logo: string;
}
export default function EditWorkHistory({
  allData,
  data,
  logo,
}: EditWorkHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: data.company,
      title: data.title,
      typeJob: data.typeJob as "Part-Time" | "Full-Time" | "Internship",
      location: data.location,
      typeLocation: data.typeLocation as "Hybrid" | "Remote" | "On-Site",
      description: data.description,
    },
  });
  const { id } = useParams();
  async function handleDelete() {
    try {
      const workDataArray = parseWorkHistory(allData);
      const idxData = findIndexWorkData(workDataArray, data);
      workDataArray.splice(idxData, 1);

      const result = workDataArray
        .map((item) => Object.values(item).join("{/}"))
        .join("{$}");

      const profileData = {
        work_history: result,
      };
      const response = await client.put(`/profil/${id}`, profileData);
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

  async function handleEditWork(values: z.infer<typeof formSchema>) {
    try {
      const workDataArray = parseWorkHistory(allData);
      const idxData = findIndexWorkData(workDataArray, data);
      workDataArray[idxData] = values;

      const result = workDataArray
        .map((item) => Object.values(item).join("{/}"))
        .join("{$}");

      const profileData = {
        work_history: result,
      };

      const response = await client.put(`/profil/${id}`, profileData);
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
          <button className="flex px-2 py-2 mt-1 mr-1 rounded-full hover:bg-[#F3F3F3]">
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
          <form
            className="space-y-2"
            onSubmit={form.handleSubmit(handleEditWork)}
          >
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
                  <Select onValueChange={field.onChange}>
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
                  <Select onValueChange={field.onChange}>
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

            <div className="w-full flex justify-between">
              <button
                type="reset"
                onClick={() => handleDelete()}
                className="hover:bg-[#F3F3F3] hover:text-[#000000] text-[#404040] text-base font-semibold rounded-lg px-2 py-2"
              >
                Delete Work
              </button>
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
