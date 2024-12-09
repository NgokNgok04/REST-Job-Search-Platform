import { UserAPI } from "@/api/user-api";
import { APIResponse, LoginProps } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContext = {
  isLogin: boolean;
  idUser: number;
  username: string;
  name: string;
  profile_photo: string | null;
  update: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  login: (payload: LoginProps) => Promise<APIResponse>;
  logout: () => Promise<APIResponse>;
};
const AuthContext = createContext<AuthContext>({
  isLogin: false,
  idUser: 0,
  username: "Anonim",
  name: "Anonim",
  profile_photo: "",
  update: false,
  setUpdate: () => {},
  login: UserAPI.login,
  logout: UserAPI.logout,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [update, setUpdate] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [idUser, setIdUser] = useState(0);
  const [username, setUsername] = useState("Anonim");
  const [name, setName] = useState("Anonim");
  const [profile_photo, setProfile] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await UserAPI.getSelf();
        if (user.username) {
          setIsLogin(true);
          setUsername(user.username);
          setIdUser(Number(user.id));
          setName(user.name ?? "");
          setProfile(user.profile_photo ?? "");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [update]);

  async function login(payload: LoginProps) {
    const response = await UserAPI.login(payload);
    setIsLogin(true);
    setUpdate((prev) => !prev);
    return response;
  }

  async function logout() {
    const response = await UserAPI.logout();
    setIsLogin(false);
    return response;
  }

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        username,
        name,
        idUser,
        profile_photo,
        update,
        setUpdate,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
