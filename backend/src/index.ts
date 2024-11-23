import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";

const app = express();

//taruh index.ts dulu nanti dirubah kebanyakan contoh di index.ts soalnya 

app.use(express.json());
// ini sementara dulu db belum tau cara make
const users: { username: string; email: string; password: string; name: string }[] = [];

app.get("/api", (req, res) => {
  res.json({ test: ["berto", "matthew", "indra", "hals"] });
});


app.post("/api/signup", async (req: Request, res: Response) => {
  const { username, email, name, password, confirmPassword } = req.body;
  if (!username || !email || !password || !name || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  else if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  else if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  try {
    // belum hashed password, library gak jelas cik
    users.push({ username, email, password, name });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});



app.get("/api/login", (req, res) =>{
  //TODO 
});



app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});