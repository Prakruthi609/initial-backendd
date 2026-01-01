const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Nexus Analytics Backend is running 🚀");
});

// collect events
let events = [];

app.post("/collect", (req, res) => {
  events.push(req.body);
  console.log("📥 Event received:", req.body);
  res.json({ status: "ok" });
});

// fetch events
app.get("/events", (req, res) => {
  res.json(events);
});

// PORT (Render uses this)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

