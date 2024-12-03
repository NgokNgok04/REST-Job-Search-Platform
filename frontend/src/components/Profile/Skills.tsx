import { useParams } from "react-router-dom";
import backLogo from "/icons/back.png";
import { useEffect, useState } from "react";
import client from "@/utils/axiosClient";
import axios from "axios";
import NotFound from "../NotFound";
import { parseSkills } from "@/utils/parseProfile";
import EditSkills from "./EditSkills";

type ProfileResponse = {
  status: boolean;
  message: string;
  body: {
    username: string;
    name: string;
    work_history: string;
    skills: string;
    isOwner: boolean;
    isConnected: boolean;
    connection_count: string;
    profile_photo: string;
    relevant_posts: {
      id: number;
      content: string;
      created_at: string;
      updated_at: string;
      user_id: number;
    };
  };
};

export default function Skills() {
  const [isUserFound, setIsUserFound] = useState<boolean>(true);
  const [skillsData, setSkillsData] = useState("");
  const { id } = useParams();
  useEffect(() => {
    try {
      if (isNaN(Number(id))) {
        setIsUserFound(false);
      }
      async function getSkillsData() {
        const response = await client.get<ProfileResponse>(`/profil/${id}`);
        if (response.data.message == "User not found") {
          setIsUserFound(false);
        } else {
          setSkillsData(response.data.body.skills);
        }
      }
      getSkillsData();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.message || "Failed to fetch profile");
      } else if (err instanceof Error) {
        console.error(err.message);
      }
      setIsUserFound(false);
    }
  }, [id]);

  const parsedSkills = parseSkills(skillsData ?? "");

  if (!isUserFound) {
    return <NotFound />;
  }
  return (
    <div className="flex flex-col items-center mt-4 border-1 w-full gap-4">
      <div className="flex flex-col bg-white rounded-lg pb-4 w-full max-w-[576px] px-2 py-2">
        <a
          href={`/profil/${id}`}
          className="rounded-full px-2 py-2 hover:bg-[#F3F3F3] w-[36px]"
        >
          <img src={backLogo} width={20} />
        </a>
        {parsedSkills &&
          parsedSkills.map((data, idx) => {
            console.log(idx, data);
            if (data == "") return;
            return (
              <div key={idx} className="flex flex-row mt-2 gap-2 pr-2">
                <h1 className="text-sm font-semibold border-b-[1px] w-full py-2">
                  {data}
                </h1>
                <EditSkills allData={skillsData} data={data} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
