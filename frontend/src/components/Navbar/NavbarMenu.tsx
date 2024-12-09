import { Link, useLocation } from "react-router-dom";
import HomeIcon from "./HomeIcon";
import GroupIcon from "./GroupIcon";
import { ClockIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import ChatIcon from "./ChatIcon";
import NotificationIcon from "./NotificationIcon";
import { Fragment } from "react/jsx-runtime";
import { useAuth } from "@/contexts/authContext";

export default function NavbarMenu() {
  const location = useLocation();
  const { idUser, isLogin } = useAuth();
  const menuBeforeLogin = [
    {
      path: "/users",
      name: "Profile",
      icon: <UserGroupIcon height={27} width={27} />,
    },
  ];
  const menuAfterLogin = [
    {
      path: "/feeds",
      name: "Home",
      icon: <HomeIcon />,
    },
    {
      path: `/connections/${idUser}`,
      name: "My Network",
      icon: <GroupIcon />,
    },
    {
      path: "/chats",
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

  let isPublic;
  if (
    !isLogin ||
    location.pathname == "/login" ||
    location.pathname == "/register"
  ) {
    console.log("ispublic true");
    isPublic = true;
  } else {
    console.log(isLogin);
    console.log("ispublic false");
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
