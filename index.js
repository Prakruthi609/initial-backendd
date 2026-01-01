const express = require("express");
const cors = require("cors");

const app = express();
const events = [];

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.post("/collect", (req, res) => {
  events.push(req.body);
  console.log("📩 Event received:", req.body);
  res.json({ status: "ok" });
});
app.get("/events", (req, res)=>{
  res.json(events);
});

app.get("/", (req, res) => {
  res.send("Nexus Analytics Backend Running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

