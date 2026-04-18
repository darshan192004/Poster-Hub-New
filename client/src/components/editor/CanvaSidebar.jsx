import React, { useState } from "react";
import { Layout, Square, Image, Type, Folder, Upload, Search } from "lucide-react";

const TABS = [
  { id: "templates", label: "Templates", icon: Layout },
  { id: "elements", label: "Elements", icon: Square },
  { id: "uploads", label: "Uploads", icon: Image },
  { id: "text", label: "Text", icon: Type },
  { id: "projects", label: "Projects", icon: Folder },
];

const ELEMENTS = [
  { type: "rect", label: "Rectangle", icon: Square },
  { type: "circle", label: "Circle", icon: "●" },
  { type: "triangle", label: "Triangle", icon: "▲" },
];

const TEXT_PRESETS = [
  { label: "Heading Large", text: "HEADING", fontSize: 64, fontFamily: "Anton" },
  { label: "Heading", text: "Heading", fontSize: 48, fontFamily: "Poppins" },
  { label: "Subheading", text: "Subheading", fontSize: 32, fontFamily: "Poppins" },
  { label: "Body", text: "Body text", fontSize: 20, fontFamily: "Poppins" },
  { label: "Caption", text: "Caption", fontSize: 14, fontFamily: "Poppins" },
];

const CanvaSidebar = ({ 
  activeTab, 
  onTabChange, 
  onAddText, 
  onAddShape, 
  onAddImage,
  onSelectTemplate,
  currentTemplates = []
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userImages, setUserImages] = useState([]);

  const filteredTemplates = currentTemplates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: `upload-${Date.now()}`,
          url: event.target.result,
          name: file.name,
        };
        const updated = [...userImages, newImage];
        setUserImages(updated);
        localStorage.setItem("posterhub_uploads", JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  // Load saved uploads
  React.useEffect(() => {
    const saved = localStorage.getItem("posterhub_uploads");
    if (saved) {
      setUserImages(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                activeTab === tab.id
                  ? "text-purple-600 bg-purple-50 border-b-2 border-purple-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      {(activeTab === "templates" || activeTab === "projects") && (
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border-0 rounded-lg text-sm"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Templates Tab */}
        {activeTab === "templates" && (
          <div className="grid grid-cols-2 gap-2">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 border-2 border-transparent hover:border-purple-500 transition-all group relative"
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: template.background_color || '#1e293b',
                    backgroundImage: template.background_image ? `url(${template.background_image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Use</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-1 py-0.5">
                  <span className="text-[10px] text-slate-700 truncate block">
                    {template.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Elements Tab */}
        {activeTab === "elements" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium uppercase">Shapes</p>
            <div className="grid grid-cols-3 gap-2">
              {ELEMENTS.map((el) => (
                <button
                  key={el.type}
                  onClick={() => onAddShape(el.type)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-lg flex flex-col items-center gap-1 transition-colors"
                >
                  <span className="text-xl">{el.icon}</span>
                  <span className="text-[10px] text-slate-600">{el.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Uploads Tab */}
        {activeTab === "uploads" && (
          <div className="space-y-3">
            <label className="block w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-lg border-2 border-dashed border-slate-300 hover:border-purple-400 cursor-pointer transition-colors text-center">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <span className="text-sm text-slate-600">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {userImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {userImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => onAddImage(img.url)}
                    className="aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 border-transparent hover:border-purple-500 transition-all"
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Text Tab */}
        {activeTab === "text" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium uppercase">Quick Add</p>
            <div className="space-y-1">
              {TEXT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onAddText(preset.text, { fontSize: preset.fontSize, fontFamily: preset.fontFamily })}
                  className="w-full p-2 text-left bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <span className="text-sm text-slate-800 block" style={{ fontFamily: preset.fontFamily }}>
                    {preset.text}
                  </span>
                  <span className="text-[10px] text-slate-500">{preset.fontSize}px</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-3">
            {searchQuery ? (
              <p className="text-sm text-slate-500 text-center py-4">No projects found</p>
            ) : (
              <>
                <p className="text-xs text-slate-500 text-center py-4">No saved projects</p>
                <p className="text-xs text-slate-400 text-center">
                  Your designs auto-save every 30 seconds
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvaSidebar;