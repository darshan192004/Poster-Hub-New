import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Poster from "../models/Poster.js"; // ✅ Un-comment and correct import
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const router = express.Router();

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Save Poster (from base64 image)
router.post("/save",authMiddleware, async (req, res) => {
  try {
    const {
      template,
      category,
      text,
      textColor,
      phoneNumber,
      email,
      brandLogo,
      imageBase64,
    } = req.body;

    if (!template || !imageBase64) {
      return res.status(400).json({ error: "Template and base64 image are required" });
    }

    // Decode base64 image
    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, "");
    const filename = `${uuidv4()}.png`;
    const posterDir = path.join(__dirname, "../public/posters");

    // Ensure directory exists
    if (!fs.existsSync(posterDir)) {
      fs.mkdirSync(posterDir, { recursive: true });
    }

    const filePath = path.join(posterDir, filename);

    // Save file to local storage
    fs.writeFileSync(filePath, base64Data, "base64");

    const generatedPosterUrl = `http://localhost:5000/posters/${filename}`;

    // Save to MongoDB
    const newPoster = new Poster({
      user: req.user._id,
      category,
      template,
      text,
      textColor,
      phoneNumber,
      email,
      brandLogo,
      generatedPosterUrl,
    });

    await newPoster.save();

    res.status(201).json({
      message: "Poster saved successfully",
      poster: newPoster,
    });
  } catch (err) {
    console.error("Error saving poster:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Serve Poster for Download
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../public/posters", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Poster not found" });
  }

  res.download(filePath);
});

// ✅ Get User's Posters
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const posters = await Poster.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v");
    
    res.status(200).json({ posters });
  } catch (err) {
    console.error("Error fetching posters:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete Poster
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const poster = await Poster.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!poster) {
      return res.status(404).json({ error: "Poster not found" });
    }

    await Poster.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Poster deleted successfully" });
  } catch (err) {
    console.error("Error deleting poster:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
