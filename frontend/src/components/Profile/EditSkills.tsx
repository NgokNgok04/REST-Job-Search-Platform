import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import editLogo from "/icons/pencil.png";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { findIndexSkills, parseSkills } from "@/utils/parseProfile";
import client from "@/utils/axiosClient";
import { useParams } from "react-router-dom";
import axios from "axios";
interface EditSkillsProps {
  allData: string;
  data: string;
}

const formSchema = z.object({
  skill: z.string().min(1),
});
export default function EditSkills({ allData, data }: EditSkillsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skill: data,
    },
  });

  async function handleDelete() {
    try {
      const skillsDataArray = parseSkills(allData);
      console.log(skillsDataArray);
      //   console.log("LENGHT : ", skillsDataArray.length);
      const idxData = findIndexSkills(skillsDataArray, data);

      skillsDataArray.splice(idxData, 1);
      console.log(skillsDataArray);
      const result = skillsDataArray.join("{$}");
      console.log("RESULT YANG BENAR : ", result);
      const profileData = {
        skills: result,
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
  async function handleEditSkill(values: z.infer<typeof formSchema>) {
    try {
      const skillsDataArray = parseSkills(allData);
      console.log(skillsDataArray);
      const idxData = findIndexSkills(skillsDataArray, data);
      console.log(idxData);
      skillsDataArray[idxData] = values.skill;
      console.log(skillsDataArray[idxData]);
      const result = skillsDataArray[idxData];
      console.log(result);
      const profileData = {
        skills: result,
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
      //   window.location.reload();
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="w-full flex justify-end">
        <DialogTrigger asChild>
          <button className="flex px-2 py-2 mt-1 mr-1 rounded-full hover:bg-[#F3F3F3]">
            <img src={editLogo} width={20} alt="act logo" />
          </button>
        </DialogTrigger>
      </div>
      <DialogDescription />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(handleEditSkill)}
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
            <div className="w-full flex justify-between">
              <button
                type="reset"
                onClick={() => handleDelete()}
                className="hover:bg-[#F3F3F3] hover:text-[#000000] text-[#404040] text-base font-semibold rounded-lg px-2 py-2"
              >
                Delete Skill
              </button>
              <Button
                type="submit"
                className="flex justify-end bg-[#0A66C2] rounded-full"
              >
                Save Skill
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
