import Template from "../models/Template.js";

export const getAllTemplates = async (req, res) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    const filter = {};
    
    if (category && category !== "all") {
      filter.category = category;
    }
    
    const templates = await Template.find(filter)
      .sort({ usageCount: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Template.countDocuments(filter);
    
    res.json({
      success: true,
      data: templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ success: false, error: "Failed to fetch templates" });
  }
};

export const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const filter = {};
    
    if (category && category !== "all") {
      filter.category = category;
    }
    
    const templates = await Template.find(filter)
      .sort({ usageCount: -1, createdAt: -1 });
    
    const categories = await Template.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: templates,
      categories: categories.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    console.error("Error fetching templates by category:", error);
    res.status(500).json({ success: false, error: "Failed to fetch templates" });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id);
    
    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }
    
    template.usageCount += 1;
    await template.save();
    
    res.json({ success: true, data: template });
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ success: false, error: "Failed to fetch template" });
  }
};

export const searchTemplates = async (req, res) => {
  try {
    const { q, category, page = 1, limit = 50 } = req.query;
    const filter = {};
    
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ];
    }
    
    if (category && category !== "all") {
      filter.category = category;
    }
    
    const templates = await Template.find(filter)
      .sort({ usageCount: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Template.countDocuments(filter);
    
    res.json({
      success: true,
      data: templates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error searching templates:", error);
    res.status(500).json({ success: false, error: "Failed to search templates" });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const template = new Template(req.body);
    await template.save();
    
    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ success: false, error: "Failed to create template" });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }
    
    res.json({ success: true, data: template });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ success: false, error: "Failed to update template" });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findByIdAndDelete(id);
    
    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }
    
    res.json({ success: true, message: "Template deleted" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ success: false, error: "Failed to delete template" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Template.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: categories.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, error: "Failed to fetch categories" });
  }
};

export const getFeaturedTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isFeatured: true })
      .sort({ usageCount: -1 })
      .limit(12);
    
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error("Error fetching featured templates:", error);
    res.status(500).json({ success: false, error: "Failed to fetch featured templates" });
  }
};

export const bulkCreateTemplates = async (req, res) => {
  try {
    const { templates } = req.body;
    
    if (!Array.isArray(templates) || templates.length === 0) {
      return res.status(400).json({ success: false, error: "No templates provided" });
    }
    
    const created = await Template.insertMany(templates, { ordered: false });
    
    res.status(201).json({
      success: true,
      count: created.length,
      data: created
    });
  } catch (error) {
    console.error("Error bulk creating templates:", error);
    res.status(500).json({ success: false, error: "Failed to bulk create templates" });
  }
};

export const getTemplateCanvas = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id).select('canvasData dimensions name category');
    
    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }
    
    template.usageCount += 1;
    await template.save();
    
    res.json({
      success: true,
      data: {
        canvasData: template.canvasData,
        dimensions: template.dimensions,
        name: template.name,
        category: template.category
      }
    });
  } catch (error) {
    console.error("Error fetching template canvas:", error);
    res.status(500).json({ success: false, error: "Failed to fetch template canvas" });
  }
};

export const reseedTemplates = async (req, res) => {
  try {
    await Template.deleteMany({});
    const { seedTemplates } = await import("../utils/seedTemplates.js");
    const result = await seedTemplates();
    res.json(result);
  } catch (error) {
    console.error("Error reseeding:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const saveAsTemplate = async (req, res) => {
  try {
    const { name, category, subcategory, tags, canvasData, dimensions, thumbnail, isFeatured, isPremium } = req.body;
    
    if (!name || !category || !canvasData) {
      return res.status(400).json({ success: false, error: "Name, category, and canvasData are required" });
    }
    
    const template = new Template({
      name,
      category,
      subcategory,
      tags: tags || [],
      canvasData,
      dimensions: dimensions || { width: 1080, height: 1080 },
      thumbnail,
      isEditable: true,
      isFeatured: isFeatured || false,
      isPremium: isPremium || false,
      type: 'canvas'
    });
    
    await template.save();
    
    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error("Error saving template:", error);
    res.status(500).json({ success: false, error: "Failed to save template" });
  }
};

export const updateTemplateCanvas = async (req, res) => {
  try {
    const { id } = req.params;
    const { canvasData, dimensions, thumbnail } = req.body;
    
    const updateData = { updatedAt: Date.now() };
    if (canvasData) updateData.canvasData = canvasData;
    if (dimensions) updateData.dimensions = dimensions;
    if (thumbnail) updateData.thumbnail = thumbnail;
    
    const template = await Template.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!template) {
      return res.status(404).json({ success: false, error: "Template not found" });
    }
    
    res.json({ success: true, data: template });
  } catch (error) {
    console.error("Error updating template canvas:", error);
    res.status(500).json({ success: false, error: "Failed to update template canvas" });
  }
};