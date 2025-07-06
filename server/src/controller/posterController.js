import Poster from "../models/Poster.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePoster = async (req, res) => {
  try {
    const { text, brandLogo, phoneNumber, email, templateName } = req.body;

    // Get the template image
    const templatePath = path.join(__dirname, `../public/templates/${templateName}.png`);
    const outputDir = path.join(__dirname, "../public/posters");
    const outputFileName = `${Date.now()}_poster.png`;
    const outputPath = path.join(outputDir, outputFileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.copyFileSync(templatePath, outputPath);

    // Save info in DB
    const newPoster = new Poster({
      text,
      brandLogo,
      phoneNumber,
      email,
      imageUrl: `/posters/${outputFileName}`,
    });

    await newPoster.save();

    res.status(201).json({
      message: "Poster generated successfully",
      imageUrl: newPoster.imageUrl,
    });
  } catch (error) {
    console.error("Error generating poster:", error);
    res.status(500).json({ message: "Failed to generate poster" });
  }
};
