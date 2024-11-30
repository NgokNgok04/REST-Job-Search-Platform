import { useRef, useState } from "react";
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
import client from "@/utils/axiosClient";
import { useParams } from "react-router-dom";
interface EditPPProps {
  photo: string;
}
export default function EditPP({ photo }: EditPPProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [pp, setPP] = useState(photo);
  const [previewUrl, setPreviewUrl] = useState(photo); // Handle client-side preview
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      formRef.current?.submit();
      setPreviewUrl(URL.createObjectURL(event.target.files[0]));
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!image) {
      alert("Please select an image.");
      console.log("g aada gambar");
      return;
    }
    console.log("berhasil bos");

    const formData = new FormData();
    formData.append("image", image);
    setPP(previewUrl);

    try {
      const response = await client.put(`/profil/${id}`, formData);
      alert("Image uploaded successfully: " + response.data.path);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex px-2 py-2 mt-1 mr-1 rounded-full">
          <img
            className="absolute translate-y-[-55%] translate-x-[20px]"
            src={pp}
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
          <form
            ref={formRef}
            id="uploadForm"
            onSubmit={handleSubmit}
            className="flex flex-col items-center"
          >
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
          </form>
          <button className="flex flex-col items-center hover:bg-[#44474B] px-2 py-2 rounded-lg">
            <img src={deleteLogo} width={20} alt="Trash Button" />
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
