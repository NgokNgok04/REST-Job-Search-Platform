import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import responseAPI from "../utils/responseAPI";
import User from "../models/User";
import Connection from "../models/Connection";
const prisma = new PrismaClient();

export const ProfileController = {
  getSelf: async (req: any, res: any) => {
    try {
      const isLogin = !!req.cookies.authToken;

      if (!isLogin) {
        responseAPI(res, 200, false, "User are not login!");
        return;
      }

      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET || ""
      );
      req.user = decoded;

      const user = await User.getUser(req.user.id);

      if (!user) {
        responseAPI(res, 200, false, "User not found");
        return;
      }
      const data = {
        username: user.username,
        id: req.user.id,
        name: user.full_name,
        profile_photo: user.profile_photo_path,
      };

      responseAPI(res, 200, true, "Success get User Data", data);
      return;
    } catch (err: unknown) {
      responseAPI(res, 500, false, "Internal Server Error", {});
      return;
    }
  },
  getProfile: async (req: any, res: any) => {
    if (isNaN(Number(req.params.id))) {
      responseAPI(res, 200, false, "Please enter valid id");
      return;
    }

    try {
      const user = await User.getUser(req.params.id);
      if (!user) {
        responseAPI(res, 200, false, "User not found");
        return;
      }

      const connCount = await Connection.getTotalConnection(req.params.id);
      const data = {
        username: user.username,
        name: user.full_name,
        work_history: user.work_history,
        isOwner: false,
        skills: user.skills,
        isConnected: false,
        connection_count: connCount.toString(),
        profile_photo: user.profile_photo_path,
        relevant_posts: {},
      };

      const isLogin = !!req.cookies.authToken;

      //publik
      if (!isLogin) {
        responseAPI(res, 200, true, `Success get Profile from Public`, data);
        return;
      }

      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET || ""
      );
      req.user = decoded;

      const posts = await User.getPosts(req.params.id);
      if (req.user.id == req.params.id) {
        //Owner
        data.isOwner = true;
        data.relevant_posts = posts;
        responseAPI(res, 200, true, "Success get Profile Owner", data);
        return;
      }

      //profil orang
      const isConnected = await User.isConnected(req.user.id, req.params.id);
      data.isOwner = false;
      data.isConnected = isConnected;
      responseAPI(res, 200, true, "Success get Profile Another People", data);
      return;
    } catch (err: unknown) {
      responseAPI(res, 500, false, "Internal Server Error", {});
    }
  },
  setProfile: async (req: any, res: any) => {
    try {
      const { username, full_name, profile_photo_path, work_history, skills } =
        req.body;
      const file = req.file;
      if (username == "") {
        responseAPI(res, 200, true, "Username cant be empty");
        return;
      }
      let path: string | null = "";
      if (profile_photo_path && profile_photo_path == "undefined") {
        path = null;
      } else {
        path = profile_photo_path;
      }
      const profileData = {
        username: username,
        full_name: full_name,
        work_history: work_history,
        profile_photo_path: path,
        skills: skills,
      } as {
        username: string;
        full_name: string;
        work_history: string;
        skills: string;
        profile_photo_path: string | null;
      };
      if (file) {
        if (req.file.filename === "undefined") {
          profileData.profile_photo_path = "/store/profile.png";
        } else {
          profileData.profile_photo_path = `/store/${req.file.filename}`;
        }
      }

      User.setUser(req.params.id, profileData);
      responseAPI(res, 200, true, "Profile updated successfuly", profileData);
      return;
    } catch (err) {
      responseAPI(res, 500, false, "Internal Server Error");
      return;
    }
  },
};
