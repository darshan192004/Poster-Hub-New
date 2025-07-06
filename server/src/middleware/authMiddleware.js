import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust path if needed

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user object from DB (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.user = user; // ✅ Sets full user with _id, name, email
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

export default authMiddleware;
