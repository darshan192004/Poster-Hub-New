import React from "react";
import { useNavigate } from "react-router-dom";
import { Paintbrush, Layers, Share2, Zap, Download, Palette, Users, Award } from "lucide-react";
import Button from "./Button";

const WhyGetStarted = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Paintbrush,
      title: "Easy to Use",
      description: "Intuitive drag-and-drop interface that anyone can use",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Layers,
      title: "100+ Templates",
      description: "Professional designs for any occasion",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Download or share your posters instantly",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Fast Creation",
      description: "Make a poster in less than 5 minutes",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Happy Users" },
    { icon: Download, value: "50K+", label: "Posters Created" },
    { icon: Palette, value: "100+", label: "Templates" },
    { icon: Award, value: "4.9", label: "User Rating" },
  ];

  return (
    <>
      {/* Stats Section */}
      <section className="w-full py-12 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-white/80" />
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Poster Maker Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Why Choose Poster Hub?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Create stunning posters in minutes with our powerful yet easy-to-use design tool.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-purple-100 via-pink-50 to-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>No design skills required</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Ready to Create Your Poster?
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of satisfied users and start designing your perfect poster today. 
              It's free to get started!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => navigate("/templates")}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
              >
                Start Creating Now
              </Button>
              <Button 
                onClick={() => navigate("/features")}
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50 px-8 py-4 rounded-full font-semibold"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                No credit card required
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyGetStarted;
