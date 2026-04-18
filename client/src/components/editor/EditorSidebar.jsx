import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Image, 
  Type, 
  Square, 
  Circle, 
  Triangle, 
  Hexagon, 
  Upload, 
  Search,
  Filter,
  Grid,
  Plus,
  X
} from 'lucide-react';

const FONTS = [
  { name: 'Poppins', label: 'Poppins' },
  { name: 'Montserrat', label: 'Montserrat' },
  { name: 'Playfair Display', label: 'Playfair Display' },
  { name: 'Anton', label: 'Anton' },
  { name: 'Pacifico', label: 'Pacifico' },
  { name: 'Roboto', label: 'Roboto' },
];

const SHAPES = [
  { type: 'rect', label: 'Rectangle', icon: Square },
  { type: 'circle', label: 'Circle', icon: Circle },
  { type: 'triangle', label: 'Triangle', icon: Triangle },
  { type: 'polygon', label: 'Hexagon', icon: Hexagon },
];

const PRESET_TEXTS = [
  { label: 'Title', fontSize: 48, fontWeight: 'bold' },
  { label: 'Subtitle', fontSize: 24, fontWeight: 'normal' },
  { label: 'Body', fontSize: 18, fontWeight: 'normal' },
  { label: 'Caption', fontSize: 14, fontWeight: 'normal' },
  { label: 'Button', fontSize: 16, fontWeight: 'bold' },
];

const EditorSidebar = ({ onAddText, onAddImage, onAddShape, onSelectTemplate, searchQuery, onSearchChange }) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    if (activeTab === 'templates') {
      fetchTemplates();
    }
  }, [activeTab, selectedCategory]);

  useEffect(() => {
    loadUserImages();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const res = await fetch(`${apiUrl}/api/templates?limit=50${categoryParam}`);
      const data = await res.json();
      
      if (data.success) {
        setTemplates(data.data);
        
        if (selectedCategory === 'all' && data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    }
    setLoading(false);
  };

  const loadUserImages = () => {
    const savedImages = localStorage.getItem('userUploadedImages');
    if (savedImages) {
      setUserImages(JSON.parse(savedImages));
    }
  };

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
        const updatedImages = [...userImages, newImage];
        setUserImages(updatedImages);
        localStorage.setItem('userUploadedImages', JSON.stringify(updatedImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddText = (preset) => {
    onAddText?.('New Text', { fontSize: preset.fontSize, fontWeight: preset.fontWeight });
  };

  const handleAddShape = (shapeType) => {
    onAddShape?.(shapeType);
  };

  const handleTemplateSelect = (template) => {
    onSelectTemplate?.(template);
  };

  const filteredTemplates = searchQuery 
    ? templates.filter(t => t.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : templates;

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'elements', label: 'Elements', icon: Grid },
    { id: 'uploads', label: 'Uploads', icon: Image },
  ];

  return (
    <div className="w-56 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
              activeTab === tab.id
                ? 'text-purple-400 bg-gray-700/50 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-2 border-b border-gray-700 shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-xs placeholder-gray-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="p-2">
            {/* Categories */}
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2 py-1 text-[10px] whitespace-nowrap rounded-full transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-2 py-1 text-[10px] whitespace-nowrap rounded-full transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            {/* Template Grid */}
            {loading ? (
              <div className="text-center py-8 text-gray-500 text-xs">Loading...</div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No templates found
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredTemplates.map((template) => (
                  <button
                    key={template._id}
                    onClick={() => handleTemplateSelect(template)}
                    className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-700 border-2 border-transparent hover:border-purple-500 transition-all group relative"
                  >
                    {template.thumbnail || template.backgroundImage ? (
                      <img
                        src={template.thumbnail || template.backgroundImage}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : template.backgroundColor ? (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: template.backgroundColor }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Use</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
                      <span className="text-white text-[8px] truncate block">
                        {template.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ELEMENTS TAB */}
        {activeTab === 'elements' && (
          <div className="p-2 space-y-4">
            {/* Text Presets */}
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Type className="w-3 h-3" /> Text
              </p>
              <div className="grid grid-cols-2 gap-1">
                {PRESET_TEXTS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddText(preset)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-left transition-colors"
                  >
                    <span className="text-white text-xs block">{preset.label}</span>
                    <span className="text-gray-500 text-[8px]">{preset.fontSize}px</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shapes */}
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Grid className="w-3 h-3" /> Shapes
              </p>
              <div className="grid grid-cols-2 gap-1">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.type}
                    onClick={() => handleAddShape(shape.type)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2 transition-colors"
                  >
                    <shape.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-xs">{shape.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add Image */}
            <div>
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Image className="w-3 h-3" /> Quick Add
              </p>
              <label className="block w-full p-3 bg-gray-700 hover:bg-gray-600 rounded border-2 border-dashed border-gray-600 hover:border-purple-500 cursor-pointer transition-colors text-center">
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <span className="text-gray-400 text-xs">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
        )}

        {/* UPLOADS TAB */}
        {activeTab === 'uploads' && (
          <div className="p-2">
            {/* Upload Button */}
            <label className="block w-full p-3 bg-gray-700 hover:bg-gray-600 rounded border-2 border-dashed border-gray-600 hover:border-purple-500 cursor-pointer transition-colors text-center mb-3">
              <Plus className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <span className="text-gray-400 text-xs">Add Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {/* User Images */}
            {userImages.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">
                No uploaded images yet
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {userImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => onAddImage?.(img.url)}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-700 border-2 border-transparent hover:border-purple-500 transition-all group"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorSidebar;