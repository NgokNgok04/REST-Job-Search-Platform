import bgLinkedIn from "/background-image-linkedin.png";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

interface PersonCardProps {
  name: string;
  path: string;
  isFeedPage: boolean;
}

export default function PersonCard({
  name,
  path,
}: // isFeedPage,
PersonCardProps) {
  return (
    <div className="col-span-3">
      <Card>
        <div className="rounded-t-lg">
          <img
            className="h-[70px] w-full object-cover rounded-t-lg"
            src={bgLinkedIn}
            alt="Background Image"
          />
          <Avatar className="translate-y-[-50%] h-20 w-20 mx-auto">
            <AvatarImage src={path} />
            <AvatarFallback>Profile</AvatarFallback>
          </Avatar>
          <h1 className="text-center translate-y-[-35px] font-semibold">
            {name}
          </h1>
        </div>
      </Card>
    </div>
  );
}
