import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import responseAPI from "../utils/responseAPI";
import User from "../models/User";
import { response } from "express";
import Connection from "../models/Connection";
import Auth from "../models/Auth";
const prisma = new PrismaClient();

export const ProfileController = {
  getAllProfiles: async (req: any, res: any) => {
    try {
      const user = await prisma.user.findMany();
      const payloadUser = user.map((user) => ({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        profile_photo_path: user.profile_photo_path,
        work_history: user.work_history,
        skills: user.skills,
      }));
      res
        .status(200)
        .json({ status: true, message: "Test success", body: payloadUser });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Internal server error", body: null });
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
        responseAPI(
          res,
          200,
          true,
          `Success get Profile from Public : ${isLogin}`,
          data
        );
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
      const { username, profile_photo_path, full_name, work_history, skills } =
        req.body;
      if (username == "") {
        res
          .status(400)
          .json({ status: false, message: "Username cant be empty" });
        console.log("halooo");
        return;
      }

      const profileData = {
        username: username,
        full_name: full_name,
        work_history: work_history,
        skills: skills,
        profile_photo_path: "",
      };
      // if (req.file) {
      //   profileData.profile_photo_path = profile_photo_path.path;
      // }
      await prisma.user.update({
        where: {
          id: Number(req.params.id),
        },
        data: profileData,
      });
      res.status(200).json({
        status: true,
        message: "Profile updated successfully",
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Internal server error", body: null });
    }
  },
};
