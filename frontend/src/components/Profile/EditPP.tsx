import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import deleteLogo from "/icons/delete.png";
import cameraLogo from "/icons/camera.png";
// import client from "@/utils/axiosClient";
import { useParams } from "react-router-dom";
import axios from "axios";
import client from "@/utils/axiosClient";
interface EditPPProps {
  photo: string;
}
export default function EditPP({ photo }: EditPPProps) {
  const [image, setImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    try {
      if (!image) {
        console.log("tidak ada image");
        return;
      }

      const profileData = {
        profile_photo_path: image,
      };
      // const
      console.log(image);
      async function handleSubmit() {
        const response = await client.put(`/profil/${id}`, profileData);
        if (response.status != 200) {
          console.log("SALAH BANG");
        } else {
          console.log("BERHASIL BOS");
          console.log("IMAGE : ", image);
        }
        console.log("RESPONSE : ", response.data);
      }
      handleSubmit();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.message || "Failed to fetch profile");
      } else if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      console.log("BERHASIL");
    }
  }, [id, image]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };
  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   if (!image) {
  //     alert("Please select an image.");
  //     console.log("g aada gambar");
  //     return;
  //   }
  //   console.log("berhasil bos");

  //   const formData = new FormData();
  //   formData.append("image", image);

  //   try {
  //     const response = await client.put(`/profil/${id}`, formData);
  //     alert("Image uploaded successfully: " + response.data.path);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to upload image.");
  //   }
  // };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex px-2 py-2 mt-1 mr-1 rounded-full">
          <img
            className="absolute translate-y-[-55%] translate-x-[20px]"
            src={photo}
            width={100}
            alt="Profile Image"
          />
        </button>
      </DialogTrigger>
      <DialogDescription />
      <DialogContent className="sm:max-w-[425px] bg-[#1B1F23] text-[#FFFFFF]">
        <DialogHeader>
          <DialogTitle>Photo Profile</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <img src={photo} width={150} alt="Profile Image" />
        </div>
        <div className="flex flex-row justify-between">
          <button
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
            className="flex flex-col items-center hover:bg-[#44474B] px-2 py-2 rounded-lg"
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <img src={cameraLogo} width={20} alt="Camera" />
            Add Photo
          </button>
          <button className="flex flex-col items-center hover:bg-[#44474B] px-2 py-2 rounded-lg">
            <img src={deleteLogo} width={20} alt="Trash Button" />
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
