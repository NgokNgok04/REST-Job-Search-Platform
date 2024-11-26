import logo from "/logo.png";
import articlesLogo from "/icons/articles.svg";
import peopleLogo from "/icons/people.svg";
export default function Navbar() {
  return (
    <div className="fixed font-semibold w-full">
      <div className="flex flex-row justify-between bg-white px-10">
        <img src={logo} width={70} />
        <div className="flex justify-center gap-2">
          <button className="flex flex-col items-center justify-center">
            <img
              className="flex flex-col text-[#666666]"
              src={articlesLogo}
              width={25}
            />
            <p className="text-[#666666] font-normal text-[14px]">Feeds</p>
          </button>
          <button className="flex flex-col items-center justify-center">
            <img
              className="flex flex-col text-[#666666]"
              src={peopleLogo}
              width={20}
            />
            <p className="text-[#666666] font-normal text-[14px]">People</p>
          </button>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <button className="bg-white text-[#0A66C2] py-3 px-6 rounded-full border-[#0A66C2] border-[1px]">
            <a href="/register">Join now</a>
          </button>
          <button className="bg-[#0A66C2] text-white py-3 px-6 rounded-full">
            <a href="/login">Sign in</a>
          </button>
        </div>
      </div>
    </div>
  );
}
