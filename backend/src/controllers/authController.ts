import { prisma } from "../prisma";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET;

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const passwordChecker = (password: string) => {
  //buat password mengandung satu huruf besar, satu angka, dan satu karakter spesial
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
  return passwordRegex.test(password);
};

export const AuthController = {
  signup: async (req: any, res: any) => {
    const { username, email, name, password, confirmPassword } = req.body;
    if (!username || !email || !password || !name || !confirmPassword) {
      res
        .status(400)
        .json({ status: false, message: "All fields are required" });
      return;
    } else if (password !== confirmPassword) {
      res
        .status(400)
        .json({ status: false, message: "Passwords do not match" });
      return;
    } else if (!validateEmail(email)) {
      res.status(400).json({ status: false, message: "Invalid email" });
      return;
    } else if (password.length < 6) {
      res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    } else if (!passwordChecker(password)) {
      res.status(400).json({
        status: false,
        message:
          "Password must contain one uppercase letter, one number, and one special character",
      });
      return;
    }

    try {
      // check email dalam db
      const isExistUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (isExistUser) {
        res
          .status(400)
          .json({ status: false, message: "Email already exists" });
        return;
      }

      var salt = bcrypt.genSaltSync(10);
      var hashed_password = bcrypt.hashSync(password, salt);

      const currDatetime = new Date();
      const newUser = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password_hash: hashed_password,
          full_name: name,
          created_at: currDatetime,
          updated_at: currDatetime,
        },
      });
      if (newUser) {
        res
          .status(201)
          .json({ status: true, message: "User created successfully" });
        return;
      } else {
        res
          .status(500)
          .json({ status: false, message: "User failed to create" });
        return;
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal server error" });
      return;
    }
  },

  signin: async (req: any, res: any) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        status: false,
        message: "All fields are required",
        body: {
          token: null,
        },
      });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        res.status(400).json({
          status: false,
          message: "Email or Password is wrong",
          body: {
            token: null,
          },
        });
        return;
      }
      const isPasswordvalid = bcrypt.compareSync(password, user.password_hash);
      if (!isPasswordvalid) {
        res.status(400).json({
          status: false,
          message: "Email or Password is wrong",
          body: {
            token: null,
          },
        });
        return;
      }
      if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      const token = sign(
        {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          fullname: user.full_name,
          password: user.password_hash,
        },
        secret,
        { expiresIn: "1h" }
      );

      if (token) {
        res.cookie("authToken", token, {
          // httpOnly: true,
          // sameSite: "strict",
          expires: new Date(Date.now() + 3600000),
          // secure: true,
        });

        res.status(200).json({
          status: true,
          message: "Login successful",
          body: {
            token: token,
          },
        });
        return;
      } else {
        res.status(500).json({
          status: true,
          message: "Can't login user at the moment",
          body: {
            token: null,
          },
        });
        return;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        status: true,
        message: errorMessage,
        body: {
          token: null,
        },
      });
      return;
    }
  },

  logout: async (req: any, res: any) => {
    try {
      const token = req.cookies.authToken;
      if (!token) {
        res
          .status(400)
          .json({ status: false, message: "You are not logged in" });
        return;
      } else {
        res.clearCookie("authToken");
        res.status(200).json({ status: true, message: "Logout success" });
        return;
      }
    } catch (err) {
      res
        .status(400)
        .json({ status: false, message: "Your are not logged in" });
      return;
    }
  },


  getUser: async (req: any, res: any) => {
    try {
      const user = req.user;
      res.status(200).json({
        status: true,
        message: "User data fetched successfully",
        body: user,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        status: true,
        message: errorMessage,
        body: {
          token: null,
        },
      });
    }
  },
  //debugging
  test: async (req: any, res: any) => {
    try {
      const users = await prisma.user.findMany();

      const payloadUser = users.map((user: any) => ({
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      }));

      res
        .status(200)
        .json({ status: true, message: "Test success", body: req.user });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        status: true,
        message: errorMessage,
        body: {
          token: null,
        },
      });
    }
  },
};
