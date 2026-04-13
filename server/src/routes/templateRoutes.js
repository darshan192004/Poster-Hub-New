import express from "express";
import {
  getAllTemplates,
  getTemplatesByCategory,
  getTemplateById,
  searchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getCategories,
  getFeaturedTemplates,
  bulkCreateTemplates
} from "../controller/templateController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/featured", getFeaturedTemplates);
router.get("/search", searchTemplates);
router.get("/:category", getTemplatesByCategory);
router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);

router.post("/bulk", authMiddleware, bulkCreateTemplates);
router.post("/", authMiddleware, createTemplate);

router.put("/:id", authMiddleware, updateTemplate);
router.delete("/:id", authMiddleware, deleteTemplate);

export default router;