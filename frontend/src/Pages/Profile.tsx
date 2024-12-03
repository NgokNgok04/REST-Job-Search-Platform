import bgLinkedIn from "/background-image-linkedin.png";
import profil from "/profile.png";
import { useEffect, useState } from "react";
import client from "@/utils/axiosClient";
import axios from "axios";
import NotFound from "../components/NotFound";
import { useParams } from "react-router-dom";
import ProfileDetail from "@/components/Profile/ProfileDetail";
import EditProfile from "@/components/Profile/EditProfile";
import EditPP from "@/components/Profile/EditPP";

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

const dummyData = {
  username: "Anonim",
  name: "Anonim",
  work_history: "",
  skills: "",
  isOwner: false,
  isConnected: false,
  connection_count: "0",
  profile_photo: profil,
  relevant_posts: {
    id: 0,
    content: "",
    created_at: Date(),
    updated_at: Date(),
    user_id: 0,
  },
};

export default function ProfilPage() {
  const { id } = useParams();
  const [isUserFound, setIsUserFound] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<ProfileResponse | null>({
    status: true,
    message: "",
    body: dummyData,
  });

  useEffect(() => {
    try {
      if (isNaN(Number(id))) {
        setIsUserFound(false);
        return;
      }

      async function getProfileData() {
        const response = await client.get<ProfileResponse>(`/profil/${id}`);
        if (response.data.message == "User not found") {
          setIsUserFound(false);
        } else {
          setProfileData(response.data);
        }
      }

      getProfileData();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.message || "Failed to fetch profile");
      } else if (err instanceof Error) {
        console.error(err.message);
      }
      setIsUserFound(false);
    }
  }, [id]);

  if (!isUserFound) {
    return <NotFound />;
  }
  return (
    <div className="flex flex-col items-center mt-4 border-1 w-full gap-4">
      <div className="bg-white rounded-lg pb-4">
        <div className="rounded-t-lg">
          <img
            className="h-[144px] w-full object-cover rounded-t-lg"
            src={bgLinkedIn}
            alt="Background Image"
          />
          <EditPP
            photo={profileData?.body.profile_photo ?? "/store" + profil}
          />
        </div>
        {profileData?.body.isOwner && (
          <EditProfile
            fullName={profileData.body.name}
            username={profileData.body.username}
          />
        )}

        <div
          className={`flex flex-col px-5 ${
            profileData?.body.isOwner ? "mt-2" : "mt-14"
          } gap-2 font-semibold`}
        >
          <h1 className="text-[20px]">{profileData?.body.username}</h1>
          <h1 className="flex items-center text-[#0A66C2]">
            {profileData?.body.connection_count} Connection
          </h1>
        </div>

        {!profileData?.body.isConnected && !profileData?.body.isOwner && (
          <button className="mx-5 mt-2 mb-4 bg-[#0A66C2] text-white px-4 py-1 rounded-full">
            Connect
          </button>
        )}
      </div>
      <ProfileDetail
        work_history={profileData?.body.work_history}
        section="Work History"
        isOwner={profileData?.body.isOwner}
      />
      <ProfileDetail
        section="Skills"
        isOwner={profileData?.body.isOwner}
        skills={profileData?.body.skills}
      />
      <ProfileDetail
        section="Latest Posts"
        isOwner={profileData?.body.isOwner}
      />
    </div>
  );
}
