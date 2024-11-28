import editLogo from "/icons/pencil.png";
import addLogo from "/icons/add.png";
import AddWorkHistory from "./AddWorkHistory";
import { parseSkills, parseWorkHistory } from "@/utils/parseProfile";
import ppJob from "/icons/phJob.png";
import AddSkills from "./AddSkills";

import { useParams } from "react-router-dom";
interface SectionProps {
  section: string;
  work_history?: string;
  skills?: string;
  isOwner?: boolean;
}
export default function ProfileDetail({
  section,
  isOwner,
  work_history,
  skills,
}: SectionProps) {
  const parsedWork = parseWorkHistory(work_history ?? "");
  const parsedSkills = parseSkills(skills ?? "");
  const id = useParams();
  return (
    <div className="flex flex-col pl-5 pr-1 py-2 bg-white rounded-lg w-full max-w-[576px]">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-[20px] font-semibold">{section}</h1>
        {isOwner && !!work_history && (
          <div className="flex flex-row">
            <AddWorkHistory data={work_history ?? ""} logo={addLogo} />
            <div className="w-full">
              <a
                href={`/profil/work-history/${id.id}`}
                className="flex px-2 py-2 mt-1 mr-1 rounded-full  hover:bg-[#F3F3F3]"
              >
                <img src={editLogo} width={20} />
              </a>
            </div>
          </div>
        )}
        {isOwner && !!skills && (
          <div className="flex flex-row">
            <AddSkills data={skills ?? ""} logo={addLogo} />
            <div className="w-full">
              <button className="flex px-2 py-2 mt-1 mr-1 rounded-full  hover:bg-[#F3F3F3]">
                <img src={editLogo} width={20} />
              </button>
            </div>
          </div>
        )}
      </div>
      {work_history &&
        parsedWork.map((data, idx) => {
          return (
            <div key={idx + "work"} className="flex flex-row mt-2 gap-2 pr-2">
              <div className="min-w-[50px]">
                <img src={ppJob} width={50} height={50} />
              </div>

              {section === "Work History" && (
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
              )}
            </div>
          );
        })}
      {skills &&
        parsedSkills.map((data, idx) => {
          return (
            <div key={idx + "skill"} className="flex flex-row mt-2 gap-2 pr-2">
              <h1 className="text-sm font-semibold border-b-[1px] w-full py-2">
                {data}
              </h1>
            </div>
          );
        })}
    </div>
  );
}
