import React from "react";
import BackgroundWrapper from "../hoc/BackgroundWrapper";

const features = [
  { title: "Ready-Made Templates", description: "Choose from 100+ pre-designed templates." },
  { title: "Customization Options", description: "Add text, change colors, and insert your logo easily." },
  { title: "Instant Downloads", description: "Download high-quality posters in seconds." },
  { title: "Responsive Design", description: "Works seamlessly across all devices." },
  { title: "No Design Skills Needed", description: "Simple and intuitive editor for everyone." },
];

const FeaturesPage = () => {
  return (
    <BackgroundWrapper>
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Poster Hub?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-purple-700 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </BackgroundWrapper>
  );
};

export default FeaturesPage;
