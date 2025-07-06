import express from "express";
const router = express.Router();

const templateCategories = [
  {
    name: "Birthday",
    templates: [
      { name: "Kids Birthday", image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1700000000/posters/kids_birthday.jpg" },
      { name: "Adult Birthday", image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1700000000/posters/adult_birthday.jpg" }
    ],
  },
  {
    name: "Business",
    templates: [
      { name: "Corporate Event", image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1700000000/posters/corporate_event.jpg" },
      { name: "Product Launch", image: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1700000000/posters/product_launch.jpg" }
    ],
  }
];

// API Route to Get Templates
router.get("/", (req, res) => {
  res.json(templateCategories);
});

export default router;
