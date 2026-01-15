import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/chat.js";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARE
====================== */

// ✅ CORS – allow Netlify frontend
app.use(
  cors({
    origin: "*", // OK for demo; restrict later if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Parse JSON bodies
app.use(express.json());

/* ======================
   ROUTES
====================== */

app.use("/api/chat", chatRoute);

// Optional health check (recommended)
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

/* ======================
   START SERVER
====================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

