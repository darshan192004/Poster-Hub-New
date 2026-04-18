import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { editableTemplates } from "../data/editableTemplates";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleTemplateClick = (templateId) => {
    navigate(`/customize-poster?id=${templateId}`);
  };

  return (
    <section className="relative w-full py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-black" />
      
      {/* Floating orbs */}
      <div className="absolute top-10 left-5 w-40 h-40 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-24 right-8 w-48 h-48 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-16 left-1/4 w-36 h-36 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container relative px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-5 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium animate-fadeIn">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI-Powered Design Tool</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fadeInUp stagger-1">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Create Stunning
              </span>
              <br />
              <span className="text-white">Posters in Minutes</span>
            </h1>
            
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0 animate-fadeInUp stagger-2">
              Choose from our beautiful templates and customize them instantly. 
              Click any template to start editing!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-3 animate-fadeInUp stagger-3">
              <Button 
                size="md" 
                onClick={() => navigate("/templates")}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
              >
                Browse All Templates
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 justify-center lg:justify-start pt-2 animate-fadeInUp stagger-4">
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-medium">10K+ Users</p>
              </div>
            </div>
          </div>

          {/* Right - Template Previews */}
          <div className="flex-1 w-full max-w-2xl animate-fadeInUp stagger-2">
            <div className="text-center mb-4">
              <span className="text-gray-400 text-sm">Click any template to start editing</span>
            </div>
            
            {/* Template Grid Preview */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {editableTemplates.slice(0, 12).map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template.id)}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scaleIn cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Background */}
                  <div
                    className="w-full h-full"
                    style={
                      template.type === "gradient" || template.type === "pattern" || template.type === "solid"
                        ? { background: template.backgroundStyle, backgroundColor: template.backgroundColor }
                        : { backgroundImage: `url(${template.background})`, backgroundSize: "cover", backgroundPosition: "center" }
                    }
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Edit</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center mt-4">
              <button 
                onClick={() => navigate("/templates")}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
              >
                View all {editableTemplates.length} templates →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
