import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Search, Grid, LayoutGrid, Loader } from "lucide-react";
import axios from "axios";
import { DESIGN_TEMPLATES } from "../data/designTemplates";

const TemplatesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [templateType, setTemplateType] = useState("fabric");

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [selectedCategory, location.key]);

  const fetchTemplates = async () => {
    // ALWAYS use DESIGN_TEMPLATES - has Unsplash backgrounds
    setTemplates(DESIGN_TEMPLATES);
    setLoading(false);
    
    // Optional: Try API for more templates, but don't wait
    /*
    try {
      const categoryParam = selectedCategory !== "all" ? `&category=${selectedCategory}` : "";
      const response = await axios.get(`/api/templates?limit=100${categoryParam}`);
      console.log("API templates:", response.data);
    } catch (e) {
      console.log("Using offline templates");
    }
    */
  };

  const fetchCategories = async () => {
    // Build categories from DESIGN_TEMPLATES
    const categoryMap = {};
    DESIGN_TEMPLATES.forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { name: t.category, count: 0 };
      }
      categoryMap[t.category].count++;
    });
    setCategories(Object.values(categoryMap));
  };

  const filteredApiTemplates = useMemo(() => {
    let result = templates;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    return result;
  }, [templates, searchQuery]);

  const categoryColors = {
    Birthday: { bg: "from-pink-500 to-rose-500", text: "text-pink-400", border: "border-pink-500" },
    Business: { bg: "from-blue-500 to-cyan-500", text: "text-blue-400", border: "border-blue-500" },
    Festivals: { bg: "from-purple-500 to-violet-500", text: "text-purple-400", border: "border-purple-500" },
    Wedding: { bg: "from-amber-500 to-yellow-500", text: "text-amber-400", border: "border-amber-500" },
    Sale: { bg: "from-red-500 to-orange-500", text: "text-red-400", border: "border-red-500" },
    Diwali: { bg: "from-yellow-500 to-orange-500", text: "text-yellow-400", border: "border-yellow-500" },
    Holi: { bg: "from-pink-500 to-purple-500", text: "text-pink-400", border: "border-pink-500" },
    "Ganesh Chaturthi": { bg: "from-yellow-500 to-amber-500", text: "text-yellow-500", border: "border-yellow-500" },
    "Kitty Party": { bg: "from-pink-500 to-rose-500", text: "text-pink-400", border: "border-pink-500" },
    Cricket: { bg: "from-green-500 to-emerald-500", text: "text-green-400", border: "border-green-500" },
    "Independence Day": { bg: "from-orange-500 to-green-500", text: "text-orange-400", border: "border-orange-500" },
    Haldi: { bg: "from-yellow-500 to-amber-500", text: "text-yellow-500", border: "border-yellow-500" },
    Sangeet: { bg: "from-purple-500 to-pink-500", text: "text-purple-400", border: "border-purple-500" },
    Annaprashan: { bg: "from-amber-500 to-yellow-500", text: "text-amber-400", border: "border-amber-500" },
    "Half Saree": { bg: "from-pink-500 to-rose-500", text: "text-pink-400", border: "border-pink-500" },
    Eid: { bg: "from-blue-500 to-cyan-500", text: "text-blue-400", border: "border-blue-500" },
    Christmas: { bg: "from-green-500 to-red-500", text: "text-green-400", border: "border-green-500" },
    "New Year": { bg: "from-yellow-500 to-purple-500", text: "text-yellow-400", border: "border-yellow-500" },
  };

  const categoryIcons = {
    Birthday: "🎂",
    Business: "💼",
    Festivals: "🎉",
    Wedding: "💍",
    Sale: "🏷️",
    Diwali: "🪔",
    Holi: "🎨",
    "Ganesh Chaturthi": "🐘",
    "Kitty Party": "🎀",
    Cricket: "🏏",
    "Independence Day": "🇮🇳",
    Haldi: "🌼",
    Sangeet: "🎵",
    Annaprashan: "🥄",
    "Half Saree": "👘",
    Eid: "🌙",
    Christmas: "🎄",
    "New Year": "🎆",
  };

  const fabricCategories = useMemo(() => {
    const cats = {};
    DESIGN_TEMPLATES.forEach(t => {
      if (!cats[t.category]) cats[t.category] = [];
      cats[t.category].push(t);
    });
    return cats;
  }, []);

  const allFabricCategories = useMemo(() => {
    const cats = Object.keys(fabricCategories);
    return [
      { name: "all", count: DESIGN_TEMPLATES.length, icon: "🎨" },
      ...cats.map(cat => ({ name: cat, count: fabricCategories[cat].length, icon: categoryIcons[cat] || "📄" }))
    ];
  }, [fabricCategories]);

  const filteredFabricTemplates = useMemo(() => {
    let templates = DESIGN_TEMPLATES;
    if (selectedCategory !== "all") {
      templates = templates.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        (t.subcategory && t.subcategory.toLowerCase().includes(query)))
      }
    return templates;
  }, [selectedCategory, searchQuery]);

  const allApiCategories = useMemo(() => {
    const totalCount = templates.length;
    const result = [{ name: "all", count: totalCount, icon: "🎨" }, ...categories.map(cat => ({
      name: cat.name,
      count: cat.count,
      icon: categoryIcons[cat.name] || "📄"
    }))];
    return result;
  }, [categories, templates]);

  const filteredTemplates = useMemo(() => {
    let result = templates;
    
    if (selectedCategory !== "all") {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name?.localeCompare(b.name));
    }
    
    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleTemplateClick = (template) => {
    // Use hardcoded template ID if isFromHardcoded, otherwise use MongoDB _id
    const id = template.isFromHardcoded ? template.templateId : template._id;
    navigate(`/fabric-editor?id=${id}`);
  };

  const handleFabricTemplateClick = (template) => {
    navigate(`/fabric-editor?id=${template.templateId || template.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-10 md:py-16">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Professional Templates</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 animate-fadeInUp stagger-1">
            Choose Your Template
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto animate-fadeInUp stagger-2">
            {loading ? "Loading..." : filteredFabricTemplates.length} templates available. Click any template to start editing instantly.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="popular">Most Popular</option>
              <option value="name">Alphabetical</option>
              <option value="newest">Newest</option>
            </select>
            <div className="flex bg-gray-800/80 rounded-lg border border-gray-700 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Sidebar / Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-wrap">
          {(templateType === "fabric" ? allFabricCategories : allApiCategories).map((cat) => {
            const colors = categoryColors[cat.name] || categoryColors.Business;
            const icon = categoryIcons[cat.name] || "📄";
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg`
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="font-medium text-sm">{cat.name === "all" ? "All" : cat.name}</span>
                <span className={`text-xs ${selectedCategory === cat.name ? "text-white/80" : "text-gray-500"}`}>
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Template Grid */}
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
          {templateType === "fabric" ? (
            <>
              {filteredFabricTemplates.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400 mb-2">No fabric templates loaded</p>
                  <p className="text-gray-500 text-sm">Total: {DESIGN_TEMPLATES.length}</p>
                </div>
              )}
              {filteredFabricTemplates.map((template, index) => {
                const colors = categoryColors[template.category] || categoryColors.Business;
                return (
                  <button
                    key={template.templateId}
                    onClick={() => handleFabricTemplateClick(template)}
                    className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeInUp border-2 border-transparent hover:border-purple-500"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div
                      className={`w-full flex items-center justify-center text-6xl ${viewMode === "list" ? "aspect-[16/9]" : "aspect-[2/3]"}`}
                      style={{
                        background: template.canvas?.backgroundColor || "#1e293b",
                        display: "flex"
                      }}
                    >
                      <span className="text-4xl">📐</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <span className="text-white font-semibold text-sm truncate">{template.name}</span>
                      <span className="text-gray-300 text-xs">{template.category} • {template.subcategory}</span>
                      <span className="text-green-400 text-xs mt-1">Fabric.js</span>
                    </div>
                    <div className={`absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-r ${colors.bg} animate-pulse`} />
                  </button>
                );
              })}
            </>
          ) : (
            <>
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <Loader className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
                  <p className="text-gray-400">Loading templates...</p>
                </div>
              ) : filteredTemplates.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400 mb-2">No templates loaded</p>
                  <p className="text-gray-500 text-sm">Total: {templates.length}</p>
                </div>
              )}
              {filteredTemplates.map((template, index) => {
                const colors = categoryColors[template.category] || categoryColors.Business;
                return (
                  <button
                    key={template._id || template.id || template.templateId}
                    onClick={() => handleTemplateClick(template)}
                    className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeInUp border-2 border-transparent hover:border-purple-500"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div
                      className={`w-full flex items-center justify-center text-6xl ${viewMode === "list" ? "aspect-[16/9]" : "aspect-[2/3]"}`}
                      style={{
                        backgroundColor: template.backgroundColor || '#1e293b',
                        backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <span className="text-white font-semibold text-sm truncate">{template.name}</span>
                  <span className="text-gray-300 text-xs">{template.category}</span>
                </div>
                
                {/* Category indicator */}
                <div className={`absolute top-2 left-2 w-2 h-2 rounded-full bg-gradient-to-r ${colors.bg} animate-pulse`} />
                
                {/* Hover scale effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            );
          })}
            </>
          )}
        </div>

        {/* No results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No templates found matching your search.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-4 text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center animate-fadeInUp stagger-3">
          <p className="text-gray-500 text-sm">
            Need a custom design?{" "}
            <button onClick={() => navigate("/contact")} className="text-purple-400 hover:text-purple-300">
              Contact us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;