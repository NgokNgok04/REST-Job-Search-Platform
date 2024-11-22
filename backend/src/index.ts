import express from "express";
const app = express();

app.get("/api", (req, res) => {
  res.json({ test: ["berto", "matthew", "indra", "hals"] });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
