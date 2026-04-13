import mongoose from "mongoose";

const templateZoneSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, default: "Text" },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  fontSize: { type: Number, default: 20 },
  fontFamily: { type: String, default: "Poppins" },
  fontWeight: { type: String, default: "normal" },
  color: { type: String, default: "#000000" },
  textAlign: { type: String, default: "center" },
  dropShadow: { type: Boolean, default: false },
  letterSpacing: { type: Number, default: 0 },
  backgroundColor: { type: String },
  padding: { type: String },
  borderRadius: { type: String },
  lineHeight: { type: Number },
}, { _id: false });

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  tags: [{ type: String }],
  style: { type: String, default: "modern" },
  type: { type: String, enum: ["gradient", "pattern", "solid", "image"], default: "gradient" },
  width: { type: Number, default: 400 },
  height: { type: Number, default: 500 },
  backgroundStyle: { type: String },
  backgroundColor: { type: String, default: "#ffffff" },
  backgroundImage: { type: String },
  isPremium: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  usageCount: { type: Number, default: 0 },
  zones: [templateZoneSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

templateSchema.index({ category: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ name: "text" });

export default mongoose.model("Template", templateSchema);