import Template from "../models/Template.js";

const UNSPLASH_BASE = "https://images.unsplash.com";

const DESIGN_TEMPLATES = [
  // ==================== SOCIAL MEDIA ====================
  {
    templateId: "insta-travel-1",
    name: "Wanderlust",
    category: "Social Media",
    subcategory: "Instagram Post",
    preview_description: "Modern Minimalist",
    style_category: "travel",
    canvas: { width: 1080, height: 1080, backgroundColor: "#0f172a" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1506905925346-21bda4d32df?w=1080&h=1080&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 1080, height: 1080, fill: "#0f172a", opacity: 0.7 },
      { type: "circle", id: "shape1", left: 850, top: 200, radius: 150, fill: "#f59e0b", opacity: 0.3 },
      { type: "text", id: "title", text: "WANDERLUST", left: 540, top: 280, originX: "center", originY: "center", fontFamily: "Anton", fontSize: 72, fill: "#ffffff", fontWeight: "bold" },
      { type: "text", id: "subtitle", text: "Explore the Unknown", left: 540, top: 380, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 24, fill: "#f59e0b" },
      { type: "text", id: "body", text: "Book your adventure today and create memories that last a lifetime.", left: 540, top: 700, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 18, fill: "#cbd5e1", textAlign: "center" },
      { type: "text", id: "cta", text: "BOOK NOW →", left: 540, top: 920, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 20, fontWeight: "bold", fill: "#f59e0b" }
    ]
  },
  {
    templateId: "insta-sale-1",
    name: "Flash Sale Alert",
    category: "Social Media",
    subcategory: "Instagram Post",
    preview_description: "Bold High Impact",
    style_category: "sale",
    canvas: { width: 1080, height: 1080, backgroundColor: "#dc2626" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1607083209570-6cbf9a053?w=1080&h=1080&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 1080, height: 1080, fill: "#dc2626", opacity: 0.85 },
      { type: "rect", id: "accent-bar", left: 40, top: 40, width: 20, height: 1000, fill: "#fef3c7" },
      { type: "text", id: "badge", text: "⚡ FLASH SALE", left: 540, top: 150, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 24, fontWeight: "bold", fill: "#fef3c7" },
      { type: "text", id: "title", text: "50% OFF", left: 540, top: 350, originX: "center", originY: "center", fontFamily: "Anton", fontSize: 140, fontWeight: "bold", fill: "#ffffff" },
      { type: "text", id: "subtitle", text: "ON EVERYTHING", left: 540, top: 480, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 32, fill: "#fef3c7" },
      { type: "text", id: "timer", text: "Ends in 24 hours!", left: 540, top: 650, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 20, fill: "#fecaca" },
      { type: "rect", id: "cta-bg", left: 400, top: 800, width: 280, height: 60, fill: "#ffffff", rx: 30 },
      { type: "text", id: "cta", text: "SHOP NOW", left: 540, top: 830, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 18, fontWeight: "bold", fill: "#dc2626" }
    ]
  },
  {
    templateId: "insta-birthday-1",
    name: "Birthday Burst",
    category: "Social Media",
    subcategory: "Instagram Post",
    preview_description: "Playful Celebration",
    style_category: "birthday",
    canvas: { width: 1080, height: 1080, backgroundColor: "#fce7f3" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1530103862676-de7c5db23d6d?w=1080&h=1080&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 1080, height: 1080, fill: "#fce7f3", opacity: 0.9 },
      { type: "circle", id: "shape1", left: 150, top: 150, radius: 100, fill: "#ec4899", opacity: 0.2 },
      { type: "circle", id: "shape2", left: 930, top: 900, radius: 80, fill: "#8b5cf6", opacity: 0.2 },
      { type: "text", id: "badge", text: "🎉", left: 540, top: 150, originX: "center", originY: "center", fontSize: 48 },
      { type: "text", id: "title", text: "HAPPY BIRTHDAY!", left: 540, top: 280, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 56, fontWeight: "bold", fill: "#db2777" },
      { type: "text", id: "name", text: "Sarah", left: 540, top: 400, originX: "center", originY: "center", fontFamily: "Pacifico", fontSize: 72, fill: "#db2777" },
      { type: "text", id: "body", text: "Wishing you an amazing year ahead!", left: 540, top: 600, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 24, fill: "#831843" },
      { type: "text", id: "footer", text: "Let's celebrate! 🎂", left: 540, top: 850, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 20, fill: "#be185d" }
    ]
  },
  {
    templateId: "insta-food-1",
    name: "Foodie Heaven",
    category: "Social Media",
    subcategory: "Instagram Post",
    preview_description: "Gourmet Elegant",
    style_category: "food",
    canvas: { width: 1080, height: 1080, backgroundColor: "#1c1917" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1546069901-ba64f1274d1d?w=1080&h=1080&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 1080, height: 1080, fill: "#1c1917", opacity: 0.75 },
      { type: "text", id: "title", text: "TASTE THE", left: 540, top: 200, originX: "center", originY: "center", fontFamily: "Playfair Display", fontSize: 36, fill: "#a3a3a3" },
      { type: "text", id: "subtitle", text: "EXTRAORDINARY", left: 540, top: 270, originX: "center", originY: "center", fontFamily: "Playfair Display", fontSize: 56, fontWeight: "bold", fill: "#f59e0b" },
      { type: "text", id: "body", text: "Fresh ingredients\nWorld-class recipes\nUnforgettable experience", left: 540, top: 550, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 20, fill: "#d4d4d4", textAlign: "center", lineHeight: 1.8 },
      { type: "rect", id: "cta-bg", left: 420, top: 780, width: 240, height: 50, fill: "#f59e0b", rx: 25 },
      { type: "text", id: "cta", text: "ORDER NOW", left: 540, top: 805, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 16, fontWeight: "bold", fill: "#1c1917" }
    ]
  },
  {
    templateId: "fb-cover-corporate-1",
    name: " Corporate Cover",
    category: "Social Media",
    subcategory: "Facebook Cover",
    preview_description: "Corporate Professional",
    style_category: "business",
    canvas: { width: 820, height: 312, backgroundColor: "#1e3a8a" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1497366216548-37526070297c?w=820&h=312&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 820, height: 312, fill: "#1e3a8a", opacity: 0.8 },
      { type: "rect", id: "accent", left: 0, top: 0, width: 6, height: 312, fill: "#f59e0b" },
      { type: "text", id: "company", text: "COMPANY NAME", left: 40, originY: "center", fontFamily: "Montserrat", fontSize: 28, fontWeight: "bold", fill: "#ffffff" },
      { type: "text", id: "tagline", text: "Innovation & Excellence Since 2020", left: 40, top: 230, originY: "center", fontFamily: "Poppins", fontSize: 14, fill: "#93c5fd" },
      { type: "circle", id: "badge", left: 700, top: 156, radius: 40, fill: "#f59e0b" },
      { type: "text", id: "badge-text", text: "5★", left: 700, top: 156, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 14, fontWeight: "bold", fill: "#1e3a8a" }
    ]
  },
  {
    templateId: "linkedin-banner-1",
    name: "Professional Banner",
    category: "Social Media",
    subcategory: "LinkedIn Banner",
    preview_description: "Executive Minimalist",
    style_category: "business",
    canvas: { width: 1584, height: 396, backgroundColor: "#0f172a" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1560472354-b33ff014c8b3?w=1584&h=396&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 1584, height: 396, fill: "#0f172a", opacity: 0.85 },
      { type: "text", id: "name", text: "JOHN DOE", left: 80, top: 150, originY: "center", fontFamily: "Montserrat", fontSize: 42, fontWeight: "bold", fill: "#ffffff" },
      { type: "text", id: "title", text: "Senior Software Engineer", left: 80, top: 210, originY: "center", fontFamily: "Poppins", fontSize: 20, fill: "#94a3b8" },
      { type: "line", id: "divider", left: 80, top: 260, width: 100, height: 2, fill: "#f59e0b" },
      { type: "text", id: "contact", text: "john.doe@company.com | linkedin.com/in/johndoe", left: 80, top: 290, originY: "center", fontFamily: "Poppins", fontSize: 14, fill: "#64748b" }
    ]
  },
  {
    templateId: "twitter-announce-1",
    name: "Product Launch",
    category: "Social Media",
    subcategory: "Twitter Post",
    preview_description: "Tech Startup",
    style_category: "tech",
    canvas: { width: 1600, height: 900, backgroundColor: "#0f172a" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1550751827-4bd374c3f58b?w=1600&h=900&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 1600, height: 900, fill: "#0f172a", opacity: 0.8 },
      { type: "rect", id: "new-badge", left: 1350, top: 50, width: 180, height: 36, fill: "#22c55e", rx: 18 },
      { type: "text", id: "badge", text: "NEW", left: 1440, top: 68, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 14, fontWeight: "bold", fill: "#0f172a" },
      { type: "text", id: "title", text: "Introducing Our", left: 100, top: 180, originY: "center", fontFamily: "Poppins", fontSize: 24, fill: "#94a3b8" },
      { type: "text", id: "subtitle", text: "NEW PRODUCT", left: 100, top: 250, originY: "center", fontFamily: "Anton", fontSize: 64, fontWeight: "bold", fill: "#ffffff" },
      { type: "text", id: "body", text: "The all-new solution that transforms how you work.\nBuilt with cutting-edge technology.", left: 100, top: 400, originY: "center", fontFamily: "Poppins", fontSize: 20, fill: "#cbd5e1", lineHeight: 1.6 },
      { type: "rect", id: "cta-bg", left: 100, top: 550, width: 160, height: 48, fill: "#6366f1", rx: 24 },
      { type: "text", id: "cta", text: "Learn More", left: 180, top: 574, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 16, fontWeight: "bold", fill: "#ffffff" }
    ]
  },

  // ==================== BUSINESS ====================
  {
    templateId: "resume-modern-1",
    name: "Executive Resume",
    category: "Business",
    subcategory: "Resume",
    preview_description: "Clean Corporate",
    style_category: "professional",
    canvas: { width: 794, height: 1123, backgroundColor: "#ffffff" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1586281383118-5d69a1a6c4f8?w=794&h=1123&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "sidebar", left: 0, top: 0, width: 240, height: 1123, fill: "#1e3a8a" },
      { type: "rect", id: "accent", left: 0, top: 0, width: 4, height: 1123, fill: "#f59e0b" },
      { type: "text", id: "name", text: "JOHN DOE", left: 125, top: 60, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 28, fontWeight: "bold", fill: "#ffffff" },
      { type: "text", id: "title", text: "Software Engineer", left: 125, top: 100, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 14, fill: "#93c5fd" },
      { type: "text", id: "contact", text: "john@email.com\n+1 234 567 890\nSan Francisco, CA", left: 125, top: 180, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 11, fill: "#cbd5e1", textAlign: "center", lineHeight: 1.8 },
      { type: "rect", id: "divider", left: 30, top: 300, width: 180, height: 1, fill: "#334155" },
      { type: "text", id: "section1", text: "PROFESSIONAL SUMMARY", left: 30, top: 340, originY: "center", fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "text", id: "summary", text: "Experienced software engineer with 5+ years of expertise in full-stack development.", left: 30, top: 370, originY: "center", fontFamily: "Poppins", fontSize: 11, fill: "#475569", width: 520 },
      { type: "text", id: "section2", text: "EXPERIENCE", left: 30, top: 450, originY: "center", fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "text", id: "exp1", text: "Senior Developer\nTech Corp\n2020 - Present\nLead development team.", left: 30, top: 490, originY: "center", fontFamily: "Poppins", fontSize: 11, fill: "#475569", lineHeight: 1.6 },
      { type: "text", id: "section3", text: "SKILLS", left: 30, top: 620, originY: "center", fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "text", id: "skills", text: "JavaScript, React, Node.js, Python, AWS, PostgreSQL", left: 30, top: 650, originY: "center", fontFamily: "Poppins", fontSize: 11, fill: "#475569" },
      { type: "text", id: "section4", text: "EDUCATION", left: 30, top: 730, originY: "center", fontFamily: "Montserrat", fontSize: 12, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "text", id: "edu", text: "BS Computer Science\nUniversity of Tech\n2015 - 2019", left: 30, top: 760, originY: "center", fontFamily: "Poppins", fontSize: 11, fill: "#475569", lineHeight: 1.6 }
    ]
  },
  {
    templateId: "presentation-title-1",
    name: "Keynote Title",
    category: "Business",
    subcategory: "Presentation",
    preview_description: "Modern Corporate",
    style_category: "corporate",
    canvas: { width: 1920, height: 1080, backgroundColor: "#0f172a" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1559136555-93090faed8a?w=1920&h=1080&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 1920, height: 1080, fill: "#0f172a", opacity: 0.85 },
      { type: "circle", id: "accent1", left: 1600, top: 200, radius: 300, fill: "#6366f1", opacity: 0.15 },
      { type: "text", id: "title", text: "PRESENTATION", left: 150, top: 400, originY: "center", fontFamily: "Montserrat", fontSize: 36, fill: "#94a3b8" },
      { type: "text", id: "subtitle", text: "TITLE HERE", left: 150, top: 480, originY: "center", fontFamily: "Montserrat", fontSize: 80, fontWeight: "bold", fill: "#ffffff" },
      { type: "line", id: "divider", left: 150, top: 560, width: 120, height: 4, fill: "#6366f1" },
      { type: "text", id: "presenter", text: "Presenter Name | Company", left: 150, top: 620, originY: "center", fontFamily: "Poppins", fontSize: 24, fill: "#64748b" },
      { type: "text", id: "date", text: "2026", left: 150, top: 700, originY: "center", fontFamily: "Poppins", fontSize: 18, fill: "#475569" }
    ]
  },
  {
    templateId: "business-card-1",
    name: "Executive Card",
    category: "Business",
    subcategory: "Business Card",
    preview_description: "Premium Minimalist",
    style_category: "premium",
    canvas: { width: 1050, height: 600, backgroundColor: "#ffffff" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1557683316-973673baf7a6?w=1050&h=600&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "sidebar", left: 0, top: 0, width: 8, height: 600, fill: "#1e3a8a" },
      { type: "text", id: "name", text: "John Doe", left: 80, top: 220, originY: "center", fontFamily: "Montserrat", fontSize: 36, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "text", id: "title", text: "Senior Software Engineer", left: 80, top: 280, originY: "center", fontFamily: "Poppins", fontSize: 16, fill: "#64748b" },
      { type: "line", id: "divider", left: 80, top: 330, width: 60, height: 2, fill: "#f59e0b" },
      { type: "text", id: "email", text: "john@company.com", left: 80, top: 380, originY: "center", fontFamily: "Poppins", fontSize: 14, fill: "#475569" },
      { type: "text", id: "phone", text: "+1 234 567 8900", left: 80, top: 420, originY: "center", fontFamily: "Poppins", fontSize: 14, fill: "#475569" },
      { type: "text", id: "website", text: "www.company.com", left: 80, top: 460, originY: "center", fontFamily: "Poppins", fontSize: 14, fill: "#1e3a8a" },
      { type: "text", id: "company", text: "COMPANY", left: 850, top: 250, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 24, fontWeight: "bold", fill: "#1e3a8a", textAlign: "right" },
      { type: "text", id: "tagline", text: "Innovation & Excellence", left: 850, top: 300, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 12, fill: "#64748b", textAlign: "right" }
    ]
  },

  // ==================== MARKETING ====================
  {
    templateId: "flyer-sale-1",
    name: "Mega Sale",
    category: "Marketing",
    subcategory: "Flyer",
    preview_description: "High Impact Retail",
    style_category: "retail",
    canvas: { width: 794, height: 1123, backgroundColor: "#dc2626" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1607082350899-7e105aa58e14?w=794&h=1123&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 794, height: 1123, fill: "#dc2626", opacity: 0.85 },
      { type: "rect", id: "accent-top", left: 0, top: 0, width: 794, height: 120, fill: "#fef3c7" },
      { type: "text", id: "header", text: "🔥 MEGA SALE 🔥", left: 397, top: 60, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 28, fontWeight: "bold", fill: "#dc2626" },
      { type: "text", id: "title", text: "UP TO", left: 397, top: 280, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 32, fill: "#fecaca" },
      { type: "text", id: "discount", text: "70%", left: 397, top: 380, originX: "center", originY: "center", fontFamily: "Anton", fontSize: 160, fontWeight: "bold", fill: "#ffffff" },
      { type: "text", id: "off", text: "OFF", left: 397, top: 480, originX: "center", originY: "center", fontFamily: "Anton", fontSize: 60, fill: "#fef3c7" },
      { type: "rect", id: "code-box", left: 247, top: 600, width: 300, height: 50, fill: "#ffffff", rx: 8 },
      { type: "text", id: "code", text: "Use Code: SALE70", left: 397, top: 625, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 18, fontWeight: "bold", fill: "#dc2626" },
      { type: "text", id: "details", text: "Valid until Dec 31, 2026\nOnline & In-Store", left: 397, top: 750, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 16, fill: "#fecaca", textAlign: "center" },
      { type: "text", id: "footer", text: "Shop Now →", left: 397, top: 1000, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 24, fontWeight: "bold", fill: "#ffffff" }
    ]
  },
  {
    templateId: "poster-event-1",
    name: "Music Festival",
    category: "Marketing",
    subcategory: "Poster",
    preview_description: "Bold Dynamic",
    style_category: "entertainment",
    canvas: { width: 1587, height: 2245, backgroundColor: "#0f172a" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1459749411177-2a2528200d6e1?w=1587&h=2245&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "overlay", left: 0, top: 0, width: 1587, height: 2245, fill: "#0f172a", opacity: 0.85 },
      { type: "circle", id: "shape1", left: 1200, top: 400, radius: 350, fill: "#8b5cf6", opacity: 0.2 },
      { type: "circle", id: "shape2", left: 200, top: 1800, radius: 250, fill: "#ec4899", opacity: 0.15 },
      { type: "text", id: "live", text: "LIVE", left: 794, top: 250, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 24, fontWeight: "bold", fill: "#ef4444" },
      { type: "text", id: "title", text: "MUSIC", left: 794, top: 400, originX: "center", originY: "center", fontFamily: "Anton", fontSize: 100, fill: "#ffffff" },
      { type: "text", id: "subtitle", text: "FESTIVAL", left: 794, top: 520, originX: "center", originY: "center", fontFamily: "Anton", fontSize: 100, fill: "#ffffff" },
      { type: "line", id: "divider", left: 594, top: 680, width: 400, height: 4, fill: "#8b5cf6" },
      { type: "text", id: "date", text: "DECEMBER 20, 2026", left: 794, top: 800, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 32, fill: "#f59e0b" },
      { type: "text", id: "venue", text: "Central Park, NYC", left: 794, top: 880, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 24, fill: "#94a3b8" },
      { type: "text", id: "lineup", text: "Featuring Top Artists", left: 794, top: 1050, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 20, fill: "#cbd5e1" },
      { type: "rect", id: "ticket", left: 387, top: 1200, width: 814, height: 100, fill: "#8b5cf6", rx: 12 },
      { type: "text", id: "ticket-text", text: "GET TICKETS →", left: 794, top: 1250, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 28, fontWeight: "bold", fill: "#ffffff" },
      { type: "text", id: "price", text: "Starting at $49", left: 794, top: 1800, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 20, fill: "#64748b" },
      { type: "text", id: "footer", text: "www.musicfestival.com", left: 794, top: 2050, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 18, fill: "#475569" }
    ]
  },
  {
    templateId: "brochure-service-1",
    name: "Service Overview",
    category: "Marketing",
    subcategory: "Brochure",
    preview_description: "Clean Corporate",
    style_category: "corporate",
    canvas: { width: 1123, height: 794, backgroundColor: "#ffffff" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1553028826-f4804a6dba3b?w=1123&h=794&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "header", left: 0, top: 0, width: 1123, height: 100, fill: "#1e3a8a" },
      { type: "text", id: "company", text: "COMPANY NAME", left: 40, top: 50, originY: "center", fontFamily: "Montserrat", fontSize: 24, fontWeight: "bold", fill: "#ffffff" },
      { type: "text", id: "tagline", text: "Your Trusted Partner", left: 1043, top: 50, originX: "right", originY: "center", fontFamily: "Poppins", fontSize: 12, fill: "#93c5fd" },
      { type: "text", id: "title", text: "OUR SERVICES", left: 40, top: 180, originY: "center", fontFamily: "Montserrat", fontSize: 36, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "line", id: "divider", left: 40, top: 230, width: 100, height: 3, fill: "#f59e0b" },
      { type: "rect", id: "service1-box", left: 40, top: 280, width: 340, height: 200, fill: "#f8fafc", rx: 8 },
      { type: "text", id: "service1-title", text: "Consulting", left: 210, top: 310, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 18, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "text", id: "service1-desc", text: "Expert guidance for your business growth.", left: 210, top: 360, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 12, fill: "#475569", textAlign: "center" },
      { type: "rect", id: "service2-box", left: 391, top: 280, width: 340, height: 200, fill: "#f8fafc", rx: 8 },
      { type: "text", id: "service2-title", text: "Development", left: 561, top: 310, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 18, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "text", id: "service2-desc", text: "Custom solutions for your needs.", left: 561, top: 360, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 12, fill: "#475569", textAlign: "center" },
      { type: "rect", id: "service3-box", left: 742, top: 280, width: 340, height: 200, fill: "#f8fafc", rx: 8 },
      { type: "text", id: "service3-title", text: "Support", left: 912, top: 310, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 18, fontWeight: "bold", fill: "#1e3a8a" },
      { type: "text", id: "service3-desc", text: "24/7 dedicated assistance.", left: 912, top: 360, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 12, fill: "#475569", textAlign: "center" },
      { type: "text", id: "cta", text: "Contact us today! →", left: 561, top: 600, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 18, fill: "#1e3a8a" },
      { type: "text", id: "footer", text: "info@company.com | www.company.com", left: 561, top: 750, originX: "center", originY: "center", fontFamily: "Poppins", fontSize: 12, fill: "#64748b" }
    ]
  },

  // ==================== PERSONAL ====================
  {
    templateId: "card-birthday-1",
    name: "Elegant Birthday",
    category: "Personal",
    subcategory: "Birthday Card",
    preview_description: "Sophisticated Celebration",
    style_category: "elegant",
    canvas: { width: 508, height: 356, backgroundColor: "#fdf4ff" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1519834785169-5afe0f9ffd89?w=508&h=356&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "frame", left: 8, top: 8, width: 492, height: 340, fill: "#be185d", rx: 4 },
      { type: "rect", id: "inner", left: 16, top: 16, width: 476, height: 324, fill: "#fdf4ff" },
      { type: "text", id: "title", text: "Happy Birthday!", left: 254, top: 80, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: "bold", fill: "#be185d" },
      { type: "text", id: "name", text: "Sarah", left: 254, top: 140, originX: "center", originY: "center", fontFamily: "Pacifico", fontSize: 42, fill: "#be185d" },
      { type: "text", id: "message", text: "Wishing you an amazing year ahead!", left: 254, top: 220, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 14, fill: "#9d174d" },
      { type: "text", id: "from", text: "With love, Family", left: 254, top: 310, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 12, fill: "#be185d" }
    ]
  },
  {
    templateId: "invitation-wedding-1",
    name: "Wedding Luxe",
    category: "Personal",
    subcategory: "Invitation",
    preview_description: "Classic Elegance",
    style_category: "luxury",
    canvas: { width: 508, height: 356, backgroundColor: "#fafafa" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1519741497676-611481813552?w=508&h=356&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "border", left: 4, top: 4, width: 500, height: 348, fill: "transparent", stroke: "#d4af37", strokeWidth: 2 },
      { type: "text", id: "invite", text: "You are cordially invited", left: 254, top: 60, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 14, fill: "#57534e" },
      { type: "text", id: "names", text: "Sarah & Michael", left: 254, top: 120, originX: "center", originY: "center", fontFamily: "Playfair Display", fontSize: 32, fontWeight: "bold", fill: "#1f2937" },
      { type: "text", id: "invite-text", text: "request the honor of your presence", left: 254, top: 160, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 12, fill: "#78716c" },
      { type: "line", id: "divider", left: 154, top: 200, width: 200, height: 1, fill: "#d4af37" },
      { type: "text", id: "date", text: "Saturday, December 15, 2026", left: 254, top: 230, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 16, fill: "#1f2937" },
      { type: "text", id: "time", text: "at 4 o'clock in the afternoon", left: 254, top: 260, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 12, fill: "#57534e" },
      { type: "text", id: "venue", text: "Grand Ballroom, Downtown", left: 254, top: 300, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 12, fill: "#57534e" }
    ]
  },
  {
    templateId: "certificate-1",
    name: "Achievement Award",
    category: "Personal",
    subcategory: "Certificate",
    preview_description: "Formal Traditional",
    style_category: "formal",
    canvas: { width: 792, height: 612, backgroundColor: "#ffffff" },
    backgroundImage: `${UNSPLASH_BASE}/photo-1523059623039-9eb4d32e9422?w=792&h=612&fit=crop&auto=format`,
    objects: [
      { type: "rect", id: "border", left: 8, top: 8, width: 776, height: 596, fill: "transparent", stroke: "#d4af37", strokeWidth: 3 },
      { type: "rect", id: "inner-border", left: 20, top: 20, width: 752, height: 572, fill: "transparent", stroke: "#d4af37", strokeWidth: 1 },
      { type: "text", id: "header", text: "CERTIFICATE", left: 396, top: 80, originX: "center", originY: "center", fontFamily: "Playfair Display", fontSize: 32, fontWeight: "bold", fill: "#d4af37" },
      { type: "text", id: "subheader", text: "OF ACHIEVEMENT", left: 396, top: 120, originX: "center", originY: "center", fontFamily: "Montserrat", fontSize: 14, fill: "#6b7280" },
      { type: "text", id: "presented", text: "This certificate is presented to", left: 396, top: 200, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 16, fill: "#6b7280" },
      { type: "text", id: "recipient", text: "John Doe", left: 396, top: 270, originX: "center", originY: "center", fontFamily: "Playfair Display", fontSize: 48, fontWeight: "bold", fill: "#1f2937" },
      { type: "line", id: "divider1", left: 196, top: 320, width: 400, height: 1, fill: "#d4af37" },
      { type: "text", id: "achievement", text: "For outstanding performance and dedication\nin completing all requirements", left: 396, top: 370, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 16, fill: "#374151", textAlign: "center" },
      { type: "text", id: "date", text: "April 14, 2026", left: 250, top: 480, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 14, fill: "#6b7280" },
      { type: "text", id: "location", text: "Certificate Authority", left: 542, top: 480, originX: "center", originY: "center", fontFamily: "Cormorant Garamond", fontSize: 14, fill: "#6b7280" },
      { type: "line", id: "sig1", left: 150, top: 510, width: 200, height: 1, fill: "#374151" },
      { type: "line", id: "sig2", left: 442, top: 510, width: 200, height: 1, fill: "#374151" }
    ]
  }
];

export const seedTemplates = async () => {
  try {
    const existingCount = await Template.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} templates. Skipping seed.`);
      return { success: false, message: "Templates already exist" };
    }

    const templatesToInsert = DESIGN_TEMPLATES.map(t => ({
      name: t.name,
      category: t.category,
      subcategory: t.subcategory,
      preview_description: t.preview_description,
      style_category: t.style_category,
      type: "canvas",
      dimensions: {
        width: t.canvas.width,
        height: t.canvas.height
      },
      backgroundColor: t.canvas.backgroundColor,
      backgroundImage: t.backgroundImage,
      canvasData: {
        version: "5.3.0",
        objects: t.objects,
        background: t.canvas.backgroundColor,
        width: t.canvas.width,
        height: t.canvas.height
      },
      isEditable: true,
      isFeatured: t.subcategory === "Instagram Post" || t.subcategory === "Resume",
      isPremium: false,
      tags: [t.category.toLowerCase(), t.subcategory?.toLowerCase(), t.style_category, t.preview_description?.toLowerCase()].filter(Boolean),
      usageCount: 0
    }));

    const inserted = await Template.insertMany(templatesToInsert, { ordered: false });
    console.log(`Seeded ${inserted.length} professional templates successfully.`);
    return { success: true, count: inserted.length };
  } catch (error) {
    console.error("Error seeding templates:", error.message);
    return { success: false, error: error.message };
  }
};

export default seedTemplates;