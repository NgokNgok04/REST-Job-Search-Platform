import { Link, useLocation, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Fragment } from "react/jsx-runtime";
import { useAuth } from "@/contexts/authContext";

export default function NavbarAuth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { idUser, isLogin, logout, username, profile_photo } = useAuth();
  let isPublic;
  if (
    !isLogin ||
    location.pathname == "/login" ||
    location.pathname == "/register"
  ) {
    isPublic = true;
  } else {
    isPublic = false;
  }
  async function handleLogout() {
    try {
      const response = await logout();
      if (response.status) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Fragment>
      {!isPublic ? (
        <li className="flex flex-col items-center relative">
          <Popover>
            <PopoverTrigger>
              <Avatar className="h-7 w-7">
                <AvatarImage src={"/profile.png"} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <p className="md:flex items-center hidden">
                Me{" "}
                <span className="material-symbols-outlined">
                  arrow_drop_down
                </span>
              </p>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={15}>
              <div className="flex gap-2 mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile_photo ?? "/profile.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h1 className="font-medium text-lg">{username}</h1>
                </div>
              </div>
              <Link
                to={`/profil/${idUser}`}
                className="block mb-3 text-linkin-blue font-semibold border border-linkin-blue rounded-xl px-2 text-center transition-all duration-100 ease-in hover:ring-linkin-dark-blue hover:ring-2 hover:bg-linkin-hoverblue"
              >
                View Profile
              </Link>
              <div className="text-gray-600">
                <button
                  className="w-full text-left hover:underline"
                  onClick={() => handleLogout()}
                >
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </li>
      ) : (
        <>
          <li>
            <Link
              to="/register"
              className="font-semibold text-[#181818] py-3 px-7 rounded-full text-lg hover:bg-[#F5F5F5] transition-colors duration-100 ease-in"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="font-semibold py-3 px-7 rounded-full text-lg border-2 border-blue-600 text-blue-600 hover:bg-[#F0F7FE] transition-colors duration-100 ease-in"
            >
              Login
            </Link>
          </li>
        </>
      )}
    </Fragment>
  );
}
