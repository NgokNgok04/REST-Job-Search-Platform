import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (cb: any) => {
    cb(null, "../../store"); // Store files in 'uploads' directory
  },
  filename: (file: any, cb: any) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Give the file a unique name
  },
});

// File filter to allow only specific types (jpg, jpeg, png)
const fileFilter = (file: any, cb: any) => {
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."),
      false
    );
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
}).single("profile_photo_path");

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
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });

      const connCount = await prisma.connection.count({
        where: {
          from_id: Number(req.params.id),
        },
      });

      const posts = await prisma.feed.findMany({
        where: {
          user_id: Number(req.params.id),
        },
        take: 10,
      });

      const payLoadPosts = posts.map((post) => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at,
      }));

      const isLogin = !!req.cookies.authToken;
      if (!user) {
        res.status(404).json({
          status: false,
          message: "User not found",
          body: {},
        });
      }

      if (!isLogin) {
        //Publik
        res.status(200).json({
          status: true,
          message: "Profile data get successfully",
          body: {
            username: user?.username,
            name: user?.full_name,
            work_history: user?.work_history,
            skills: user?.skills,
            connection_count: connCount.toString(),
            profile_photo: user?.profile_photo_path,
          },
        });
      }

      const decoded = jwt.verify(
        req.cookies.authToken,
        process.env.JWT_SECRET || ""
      );
      req.user = decoded;
      const isConnected = !!(await prisma.connection.findUnique({
        where: {
          from_id_to_id: {
            from_id: Number(req.user.id),
            to_id: Number(req.params.id),
          },
        },
      }));

      if (req.user.id == req.params.id) {
        //Owner
        res.status(200).json({
          status: true,
          message: "Profile data get successfully",
          body: {
            username: user?.username,
            name: user?.full_name,
            work_history: user?.work_history,
            skills: user?.skills,
            connection_count: connCount.toString(),
            profile_photo: user?.profile_photo_path,
            relevant_posts: payLoadPosts,
          },
        });
      } else {
        //lihat profil orang lain
        res.status(200).json({
          status: true,
          message: "Profile data get successfully",
          body: {
            username: user?.username,
            name: user?.full_name,
            work_history: user?.work_history,
            skills: user?.skills,
            connection_count: connCount.toString(),
            profile_photo: user?.profile_photo_path,
            isConnected: isConnected,
            relevant_posts: payLoadPosts,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        body: {},
      });
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
        return;
      }

      upload(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
          res.status(400).json({ status: false, message: err.message });
          return;
        } else if (err) {
          res.status(400).json({
            status: false,
            message: "Invalid file type. Only JPG, JPEG, and PNG are allowed.",
          });
          return;
        }

        const profileData = {
          username: username,
          full_name: full_name,
          work_history: work_history,
          skills: skills,
          profile_photo_path: "",
        };

        if (req.file) {
          profileData.profile_photo_path = profile_photo_path.path;
        }
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
      });
    } catch (err) {
      res
        .status(500)
        .json({ status: false, message: "Internal server error", body: null });
    }
  },
};
