import express from "express";
import Jimp from "jimp"; // Image processing
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { templateUrl, companyName, email, phone } = req.body;

    const image = await Jimp.read(templateUrl);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    image.print(font, 50, 50, companyName);
    image.print(font, 50, 100, email);
    image.print(font, 50, 150, phone);

    const outputPath = path.join("public", "generated", `poster-${Date.now()}.jpg`);
    await image.writeAsync(outputPath);

    res.json({ posterUrl: `/generated/${path.basename(outputPath)}` });
  } catch (error) {
    console.error("Error generating poster:", error);
    res.status(500).json({ error: "Failed to generate poster" });
  }
});

export default router;

