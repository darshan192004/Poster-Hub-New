import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { DESIGN_TEMPLATES } from "../data/designTemplates";

const Categories = () => {
  const navigate = useNavigate();

  // Group templates by category
  const templateCategories = DESIGN_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  const handleTemplateClick = (templateId) => {
    navigate(`/fabric-editor?id=${templateId}`);
  };

  const categoryColors = {
    Birthday: { bg: "from-pink-500 to-rose-500", text: "text-pink-400" },
    Business: { bg: "from-blue-500 to-cyan-500", text: "text-blue-400" },
    Festivals: { bg: "from-purple-500 to-violet-500", text: "text-purple-400" },
    Wedding: { bg: "from-amber-500 to-yellow-500", text: "text-amber-400" },
    Sale: { bg: "from-red-500 to-orange-500", text: "text-red-400" },
  };

  const categoryIcons = {
    Birthday: "🎂",
    Business: "💼",
    Festivals: "🎉",
    Wedding: "💍",
    Sale: "🏷️",
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Professional Templates</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Browse by Category
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Click any template to start editing instantly
          </p>
        </div>

        {/* Category Sections */}
        {Object.entries(templateCategories).map(([categoryName, templates], catIndex) => {
          const colors = categoryColors[categoryName] || categoryColors.Business;
          return (
            <div key={categoryName} className="mb-10 animate-fadeInUp" style={{ animationDelay: `${catIndex * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{categoryIcons[categoryName]}</span>
                <h3 className="text-xl font-bold text-white">{categoryName}</h3>
                <span className="text-gray-500 text-sm">({templates.length} templates)</span>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
{templates.map((template, index) => (
                  <button
                    key={template._id}
                    onClick={() => handleTemplateClick(template._id)}
                    className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade"
                    style={{ animationDelay: `${(catIndex * 0.1) + (index * 0.05)}s` }}
                  >
                    {/* Background with Unsplash image */}
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: template.backgroundColor || '#1e293b',
                        backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium px-2 py-1 bg-purple-600 rounded">Edit</span>
                    </div>

                    {/* Template name */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs truncate">{template.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* View All Button */}
        <div className="text-center mt-10 animate-fadeInUp">
          <button
            onClick={() => navigate("/templates")}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
          >
            View All Templates →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
