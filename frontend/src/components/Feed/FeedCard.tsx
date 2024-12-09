import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import editLogo from "/icons/pencil.png";
import trashLogo from "/icons/trash.svg";
interface FeedCardProps {
  name: string;
  content: string;
  path: string;
  ref: React.MutableRefObject<HTMLDivElement | null> | null;
  isOwner: boolean;
}

export default function FeedCard({
  name,
  content,
  path,
  ref,
  isOwner,
}: FeedCardProps) {
  return (
    <Card className="p-4" {...ref}>
      <div className="flex justify-between gap-2">
        <div className="flex flex-row gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={path} />
            <AvatarFallback>Profile</AvatarFallback>
          </Avatar>
          <h3 className="flex font-semibold">{name}</h3>
        </div>
        <div>
          {isOwner && (
            <div className="flex flex-row">
              <button className=" flex px-2 py-2 rounded-full hover:bg-[#F3F3F3]">
                <img src={editLogo} width={20} alt="editLogo" />
              </button>
              <button className=" flex px-2 py-2 rounded-full hover:bg-[#F3F3F3]">
                <img src={trashLogo} width={21} alt="trashLogo" />
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 font-extralight">{content}</p>
    </Card>
  );
}
