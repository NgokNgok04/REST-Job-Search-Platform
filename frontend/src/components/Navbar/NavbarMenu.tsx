import { Link, useLocation } from "react-router-dom";
import { getCookie } from "@/utils/cookieHandler";
import HomeIcon from "./HomeIcon";
import GroupIcon from "./GroupIcon";
import { ClockIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import ChatIcon from "./ChatIcon";
import NotificationIcon from "./NotificationIcon";
import { Fragment } from "react/jsx-runtime";

const menuBeforeLogin = [
  {
    path: "/users",
    name: "Profile",
    icon: <UserGroupIcon height={27} width={27} />,
  },
  {
    path: "/feeds",
    name: "Home",
    icon: <HomeIcon />,
  },
];

const menuAfterLogin = [
  {
    path: "/connections/1",
    name: "My Network",
    icon: <GroupIcon />,
  },
  {
    path: "/chat/1",
    name: "Chat",
    icon: <ChatIcon />,
  },
  {
    path: "/requests",
    name: "Request",
    icon: <ClockIcon height={27} width={27} />,
  },
  {
    path: "/notifications",
    name: "Notification",
    icon: <NotificationIcon />,
  },
];

export default function NavbarMenu() {
  const auth = getCookie("authToken");
  const location = useLocation();

  let isPublic;
  if (
    auth == null ||
    location.pathname == "/login" ||
    location.pathname == "/register"
  ) {
    isPublic = true;
  } else {
    isPublic = false;
  }
  const paths = isPublic
    ? [...menuBeforeLogin]
    : [...menuBeforeLogin, ...menuAfterLogin];
  return (
    <Fragment>
      {paths.map((path, index) => (
        <li
          className={`hover:text-black relative flex items-center justify-center md:min-w-14 ${
            path.path === location.pathname ? "text-black" : ""
          }`}
          key={index}
        >
          <Link to={path.path} className="flex flex-col items-center">
            {path.icon}
            <p className="hidden md:block text-nowrap">{path.name}</p>
          </Link>

          <div
            className={`absolute -bottom-1 left-0 right-0 h-1 ${
              path.path === location.pathname ? "bg-black" : "hidden"
            }`}
          />
        </li>
      ))}
    </Fragment>
  );
}
