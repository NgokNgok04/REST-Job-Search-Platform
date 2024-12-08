import logo from "/logo.png";
import { getCookie } from "@/utils/cookieHandler";
import NavbarMenu from "./NavbarMenu";
import NavbarAuth from "./NavbarAuth";

export default function Navbar() {
  const auth = getCookie("authToken");

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

  return (
    <header className=" sticky top-0 z-20 h-16 py-1 px-4 mb-2 text-gray-800 bg-white">
      <div className="container flex justify-between items-center h-full mx-auto">
        <a className="md:w-full h-full" href="/">
          <img src={logo} width={70} />
        </a>
        <nav className={`${!isPublic ? "w-full" : "lg:w-1/4 w-2/3"}`}>
          <ul className="flex justify-around gap-2 text-sm text-gray-500 items-center">
            <NavbarMenu />
            <NavbarAuth />
          </ul>
        </nav>
      </div>
    </header>
  );
}
