import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
// const bcrypt = require('bcrypt'); masih rusak astaga

const prisma = new PrismaClient();
//ini harusnya pake database
const users: {
    username: string;
    email: string;
    password: string;
    name: string;
}[] = [];


//  thanks to stackoverflow
const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const passwordChecker = (password: string) => {
    //buat password mengandung satu huruf besar, satu angka, dan satu karakter spesial
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
    return passwordRegex.test(password);
}

export const AuthController = {
    signup: async (req: any, res: any) => {
        const { username, email, name, password, confirmPassword } = req.body;
        if (!username || !email || !password || !name || !confirmPassword) {
          res.status(400).json({ message: "All fields are required" });
          return;
        } else if (password !== confirmPassword) {
          res.status(400).json({ message: "Passwords do not match" });
          return;
        } else if (!validateEmail(email)) {
          res.status(400).json({ message: "Invalid email" });
          return;   
        } else if (password.length < 6){
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        } else if (!passwordChecker(password)){
            res.status(400).json({ message: "Password must contain one uppercase letter, one number, and one special character" });
            return;
        }

        try {
            // check email dalam db 
            const isExistUser = await prisma.user.findUnique({
                where:{
                    email: email
                }
            });

            if(isExistUser){
                res.status(400).json({ message: "Email already exists" })
                return;
            };
            
            //TODO: hashPassword pake bcrypt dengan salt 10 disini
            
            const currDatetime = new Date();
            const newUser = await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password_hash: password,
                    created_at: currDatetime,
                    updated_at: currDatetime
                }
            });
            if(newUser){
                res.status(201).json({ message: "User created successfully"});
                return;
            }else{
                res.status(500).json({ message: "User failed to create"});
                return;
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error"});
            return;
        }
    }
}