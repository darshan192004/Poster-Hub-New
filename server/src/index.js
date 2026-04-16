// index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import posterRoutes from "./routes/posterRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import { seedTemplates } from "./utils/seedTemplates.js";

dotenv.config();

const app = express();

// ✅ Increase payload size limit (for base64 image data)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ CORS config
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin,
    credentials: true,
  })
);

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Static folder for posters
app.use("/posters", express.static(path.join(__dirname, "public/posters")));

// ✅ API Routes
app.use("/api/posters", posterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/templates", templateRoutes);

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    
    // Seed templates if database is empty
    await seedTemplates();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// ✅ Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
