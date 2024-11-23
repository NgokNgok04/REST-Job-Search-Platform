import express from "express";
// import  
const app = express();

app.get("/api", (req, res) => {
  res.json({ test: ["berto", "matthew", "indra", "hals"] });
});

app.get("/api/signup", (req, res) => {
  res.json({ message: "User signed up" });
});


app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});