import { useState } from "react";
import axios from "axios";

const templates = [
  { id: 1, image: "http://localhost:5000/templates/business.png", name: "Business" },
  { id: 2, image: "http://localhost:5000/templates/birthday.png", name: "Birthday" },
  { id: 3, image: "http://localhost:5000/templates/event.png", name: "Event" },
];

const TemplatesPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    brandLogo: "",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const openModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ text: "", brandLogo: "", phoneNumber: "", email: "" });
  };

  // 📤 Submit Form Handler
  const handleGeneratePoster = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-poster",
        {
          template: selectedTemplate.name.toLowerCase(),
          ...formData,
        },
        {
          responseType: "blob", // Important for image download
        }
      );

      // ⬇️ Download Image
      const blob = new Blob([response.data], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `poster-${selectedTemplate.name.toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      closeModal();
    } catch (error) {
      console.error("Poster generation failed:", error);
      alert("Something went wrong while generating the poster.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-900 p-6">
      {/* Content Wrapper */}
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Choose a Template</h1>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-md cursor-pointer hover:border-pink-500 transform hover:scale-105 transition duration-300"
              onClick={() => openModal(template)}
            >
              <div className="w-full aspect-square overflow-hidden">
                <img src={template.image} alt={template.name} className="w-full h-full object-cover rounded-md" />
              </div>
              <p className="text-center mt-3 font-semibold text-lg text-gray-900 dark:text-gray-100">{template.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl flex flex-col md:flex-row relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-600 text-xl"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Left: Template Preview */}
            <div className="md:w-1/2 p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">Template Preview</h3>
              <div className="w-full aspect-square overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                <img src={selectedTemplate.image} alt="Template Preview" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Right: Form */}
            <div className="md:w-1/2 p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Customize Poster</h3>
              <form className="space-y-3" onSubmit={handleGeneratePoster}>
                <input
                  type="text"
                  placeholder="Enter text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Brand Logo URL (optional)"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400"
                  value={formData.brandLogo}
                  onChange={(e) => setFormData({ ...formData, brandLogo: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone Number (optional)"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Poster"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
