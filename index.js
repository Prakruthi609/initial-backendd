const express = require("express");
const cors = require("cors");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");

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
  // 1️⃣ Device + browser parsing
  const parser = new UAParser(req.headers["user-agent"]);
  const ua = parser.getResult();

  // 2️⃣ IP detection (Render / proxy safe)
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  // 3️⃣ Geo lookup
  const geo = geoip.lookup(ip);

  // 4️⃣ Build enriched event
  const event = {
    path: req.body.url,
    ref: req.body.ref || "direct",

    device: ua.device.type || "desktop",
    os: ua.os.name || "Unknown",
    browser: ua.browser.name || "Unknown",

    country: geo?.country || "Unknown",
    region: geo?.region || "Unknown",
    city: geo?.city || "Unknown",
    lat: geo?.ll?.[0] || null,
    lon: geo?.ll?.[1] || null,

    screen: req.body.screen,
    timestamp: Date.now()
  };

  events.push(event);
  console.log("📊 Event stored:", event);

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

