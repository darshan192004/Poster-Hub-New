import { useState } from "react";
import { posterTemplates } from "../data/templates";

const TemplateSelection = ({ onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSelect = (template) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template.id); // Pass the selected template ID to parent
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {posterTemplates.map((template) => (
        <div
          key={template.id}
          className={`border-2 p-2 rounded-lg cursor-pointer ${
            selectedTemplate === template.id ? "border-blue-500" : "border-gray-300"
          }`}
          onClick={() => handleSelect(template)}
        >
          <img src={template.imageUrl} alt={template.name} className="w-full rounded-md" />
          <p className="text-center mt-2 font-semibold">{template.name}</p>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelection;
