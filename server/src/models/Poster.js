import mongoose from "mongoose";

const posterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true }, // e.g., 'business', 'birthday', etc.
  template: { type: String, required: true }, // Name or ID of the selected template
  text: { type: String }, // Custom text added by the user
  brandLogo: { type: String }, // Path or URL to uploaded logo
  phoneNumber: { type: String },
  email: { type: String },
  textColor: { type: String, default: "#000000" }, // Optional: hex code or class
  generatedPosterUrl: { type: String, required: true }, // Final poster image URL
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Poster", posterSchema);
