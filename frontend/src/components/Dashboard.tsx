import homeImage from "/homeImage.svg";
import { getCookie } from "@/utils/cookieHandler";

const Dashboard = () => {
  const auth = getCookie("authToken");
  // console.log(document.cookie);
  // console.log("Auth: ", auth);
  if (auth == null) {
    return (
      <div className="flex flex-col mt-4 text-center items-center md:text-left md:flex-row md:justify-between px-4">
        <div className="flex flex-col gap-2 px-[50px]">
          <h1 className="font-sans text-[30px] lg:text-[40px] text-[#526A6E]">
            Welcome to your professional community
          </h1>
          <p>
            New to LinkedIn?{" "}
            <a className="text-[#0A66C2] font-semibold" href="/register">
              Join now
            </a>
          </p>
        </div>
        <img
          className="w-[300px] md:w-[700px]"
          src={homeImage}
          width={700}
          alt="Home Image"
        />
      </div>
    );
  } else {
    return <h1>Sudah Login</h1>;
  }
};

export default Dashboard;
