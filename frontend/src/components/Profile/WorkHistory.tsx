import { useParams } from "react-router-dom";
import backLogo from "/icons/back.png";
import { parseWorkHistory } from "@/utils/parseProfile";
import { useEffect, useState } from "react";
import client from "@/utils/axiosClient";
import axios from "axios";
import NotFound from "../NotFound";
import ppJob from "/icons/phJob.png";
import editLogo from "/icons/pencil.png";
import EditWorkHistory from "./EditWorkHistory";
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

export default function WorkHistory() {
  const [isUserFound, setIsUserFound] = useState<boolean>(true);
  const [workData, setWorkData] = useState("");
  const { id } = useParams();
  useEffect(() => {
    try {
      if (isNaN(Number(id))) {
        setIsUserFound(false);
      }
      async function getWorkData() {
        const response = await client.get<ProfileResponse>(`/profil/${id}`);
        if (response.data.message == "User not found") {
          setIsUserFound(false);
        } else {
          setWorkData(response.data.body.work_history);
        }
      }
      getWorkData();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.message || "Failed to fetch profile");
      } else if (err instanceof Error) {
        console.error(err.message);
      }
      setIsUserFound(false);
    }
  }, [id]);
  const parsedWork = parseWorkHistory(workData ?? "");
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
        {parsedWork &&
          parsedWork.map((data, idx) => {
            // console.log("dadadadada", data);
            return (
              <div key={idx} className="flex flex-row mt-2 gap-2 pr-2">
                <div className="min-w-[50px]">
                  <img src={ppJob} width={50} height={50} />
                </div>

                <div className="flex flex-col gap-[0.5px] w-full">
                  <p className="text-lg font-semibold">{data.title}</p>
                  <div className="flex flex-row text-sm gap-2 font-normal">
                    <p>{data.company}</p>
                    <p>{data.typeJob}</p>
                  </div>
                  <div className="flex flex-row text-sm gap-2 font-normal text-[#6d6d6d]">
                    <p>{data.typeLocation}</p>
                    <p>{data.location}</p>
                  </div>
                  <div className="flex ">
                    <p className="mt-2 font-thin ">{data.description}</p>
                  </div>
                </div>
                <div className="w-full">
                  <EditWorkHistory
                    allData={workData}
                    data={data}
                    logo={editLogo}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
