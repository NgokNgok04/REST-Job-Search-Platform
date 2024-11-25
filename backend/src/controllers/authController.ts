import { prisma } from "../prisma";
import { sign } from "jsonwebtoken";
import { resolve } from "path";
import bcrypt from 'bcrypt';


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

const secret = {
    key: "A_SECRET_TEMPLATE"
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
            var salt = bcrypt.genSaltSync(10);
            var hashed_password = bcrypt.hashSync(password, salt);

            const currDatetime = new Date();
            const newUser = await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password_hash: hashed_password,
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
    },

    signin: async (req: any, res: any) => {
        const { email, password } = req.body;
        if (!email || !password) {
          res.status(400).json({ message: "All fields are required" });
          return;
        }

        try {
            const user = await prisma.user.findUnique({
                where:{
                    email: email
                }
            })

            if(!user){
                res.status(400).json({ message: "Email or Password is wrong" });
                return;
            }
            const isPasswordvalid = bcrypt.compareSync(password, user.password_hash);
            if(!isPasswordvalid){
                res.status(400).json({ message: "Email or Password is wrong" });
                return;
            }
            
            const token = await new Promise((resolve, reject) => {
                sign({ id: user.id.toString, email: user.email, password: user.password_hash}, secret.key, (err: any, token: any) => {
                    if(err){
                        reject(err);
                    }
                    resolve(token);
                })
            })

            if(token){
                res.status(200).json({ message: "Login successful", token: token });
                return;
            }
            else{
                res.status(500).json({ message: "Can't login user at the moment" });
                return;
            }
        }
        catch (err){
            const errorMessage = err instanceof Error ? err.message : String(err);
            res.status(500).json({ message: errorMessage });
            return;
        }

    }
}