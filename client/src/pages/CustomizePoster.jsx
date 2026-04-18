import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import Draggable from "react-draggable";
import { editableTemplates, getTemplateById } from "../data/editableTemplates";
import {
  generateColorPalette, autoLayout, improveContrast, optimizeSizes, suggestBetterFonts, generateAIDesign
} from "../utils/aiService";
import {
  Download, Save, Trash2, Undo, Redo, Plus, Wand2, Zap, Layout, Contrast, Type, Palette, X, ArrowLeft
} from "lucide-react";

const FONTS = [
  { name: "Poppins", label: "Poppins" }, { name: "Montserrat", label: "Montserrat" },
  { name: "Lato", label: "Lato" }, { name: "Playfair Display", label: "Playfair Display" },
  { name: "Anton", label: "Anton" }, { name: "Cormorant Garamond", label: "Cormorant Garamond" },
  { name: "Mountains of Christmas", label: "Mountains of Christmas" }, { name: "Roboto", label: "Roboto" },
  { name: "Open Sans", label: "Open Sans" }, { name: "Bebas Neue", label: "Bebas Neue" },
  { name: "Pacifico", label: "Pacifico" }, { name: "Dancing Script", label: "Dancing Script" },
];

const AI_SUGGESTIONS = {
  birthday: ["Happy Birthday! 🎂 Wishing you a wonderful year!", "Another year wiser! Happy Birthday!", "May your day be filled with joy!", "Celebrating you today!"],
  business: ["Grand Opening! Come celebrate!", "50% OFF - Limited Time!", "New Collection Available!", "Free Consultation - Book Now!"],
  festival: ["Happy Diwali! 🪔 Joy & prosperity!", "Merry Christmas! 🎄 Peace & joy!", "Happy New Year! 🥂 New beginnings!", "Eid Mubarak! 🌙 Blessings!"],
  wedding: ["You're invited to celebrate our love!", "Save the Date! Our wedding!", "Together forever!", "A celebration of love awaits!"],
  sale: ["🔥 FLASH SALE! Up to 70% Off!", "BIGGEST SALE OF THE YEAR!", "FINAL CLEARANCE - 60% Off!", "HUGE SAVINGS - Shop Now!"],
};

const PRESET_COLORS = ["#FFFFFF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#F8B500", "#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#34495E", "#2C3E50", "#000000", "#1A1A2E"];

const CustomizePoster = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const posterRef = useRef(null);
  const containerRef = useRef(null);
  const templateId = params.get("id");
  const templateImage = params.get("image");

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!templateId && !templateImage);
  const [activeTab, setActiveTab] = useState("text");
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setSelectedTemplate(template);
        const initialElements = template.zones.map((zone, index) => ({
          id: `text-${index}`,
          type: "text",
          text: zone.text,
          x: zone.x,
          y: zone.y,
          fontSize: zone.fontSize,
          fontFamily: zone.fontFamily,
          fontWeight: zone.fontWeight || "normal",
          color: zone.color,
          textAlign: zone.textAlign || "center",
          rotation: 0,
          opacity: 1,
          dropShadow: zone.dropShadow || false,
          letterSpacing: zone.letterSpacing || 0,
          backgroundColor: zone.backgroundColor,
          padding: zone.padding,
          borderRadius: zone.borderRadius,
        }));
        setElements(initialElements);
        saveToHistory(initialElements);
      }
    } else if (templateImage) {
      setSelectedTemplate({ background: templateImage, name: "Custom", width: 400, height: 500 });
    }
  }, [templateId, templateImage]);

  useEffect(() => {
    const adjustZoom = () => {
      if (containerRef.current && selectedTemplate) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth - 48;
        const containerHeight = container.clientHeight - 48;
        const templateWidth = selectedTemplate.width || 400;
        const templateHeight = selectedTemplate.height || 500;
        const scaleX = containerWidth / templateWidth;
        const scaleY = containerHeight / templateHeight;
        const newZoom = Math.min(scaleX, scaleY, 1) * 0.85;
        setZoom(Math.max(0.3, newZoom));
      }
    };
    adjustZoom();
    window.addEventListener('resize', adjustZoom);
    return () => window.removeEventListener('resize', adjustZoom);
  }, [selectedTemplate]);

  const saveToHistory = useCallback((newElements) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.stringify(newElements));
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setElements(JSON.parse(history[historyIndex - 1]));
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setElements(JSON.parse(history[historyIndex + 1]));
      setHistoryIndex(historyIndex + 1);
    }
  };

  const addTextElement = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      text: "New Text",
      x: selectedTemplate?.width / 2 || 200,
      y: selectedTemplate?.height / 2 || 250,
      fontSize: 20, fontFamily: "Poppins", fontWeight: "normal",
      color: "#000000", textAlign: "center", rotation: 0, opacity: 1, dropShadow: false, letterSpacing: 0,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement.id);
    saveToHistory(newElements);
  };

  const updateElement = (id, updates) => {
    const newElements = elements.map(el => el.id === id ? { ...el, ...updates } : el);
    setElements(newElements);
    saveToHistory(newElements);
  };

  const deleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    saveToHistory(newElements);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    const initialElements = template.zones.map((zone, index) => ({
      id: `text-${index}`, type: "text", text: zone.text, x: zone.x, y: zone.y,
      fontSize: zone.fontSize, fontFamily: zone.fontFamily, fontWeight: zone.fontWeight || "normal",
      color: zone.color, textAlign: zone.textAlign || "center", rotation: 0, opacity: 1,
      dropShadow: zone.dropShadow || false, letterSpacing: zone.letterSpacing || 0,
    }));
    setElements(initialElements);
    saveToHistory(initialElements);
    setShowTemplateSelector(false);
  };

  const getAISuggestions = () => {
    const category = selectedTemplate?.category?.toLowerCase() || "business";
    return AI_SUGGESTIONS[category] || AI_SUGGESTIONS.business;
  };

  const applyAISuggestion = (suggestion) => {
    if (selectedElement) updateElement(selectedElement, { text: suggestion });
  };

  const handleAIAction = async (action) => {
    setAiLoading(true);
    try {
      switch (action) {
        case "autoLayout": {
          const canvasWidth = selectedTemplate?.width || 400;
          const layoutedElements = autoLayout(elements, canvasWidth, selectedTemplate?.height || 500);
          setElements(layoutedElements);
          saveToHistory(layoutedElements);
          break;
        }
        case "improveContrast": {
          const contrastedElements = improveContrast(elements);
          setElements(contrastedElements);
          saveToHistory(contrastedElements);
          break;
        }
        case "optimizeSizes": {
          const sizedElements = optimizeSizes(elements);
          setElements(sizedElements);
          saveToHistory(sizedElements);
          break;
        }
        case "suggestBetterFonts": {
          const fontedElements = suggestBetterFonts(elements);
          setElements(fontedElements);
          saveToHistory(fontedElements);
          break;
        }
        case "generateColors": {
          const colors = await generateColorPalette(selectedTemplate?.category?.toLowerCase() || "pink");
          if (elements.length > 0) {
            const coloredElements = elements.map((el, i) => ({ ...el, color: colors[i % colors.length] }));
            setElements(coloredElements);
            saveToHistory(coloredElements);
          }
          break;
        }
        case "generateAIDesign": {
          const design = await generateAIDesign(selectedTemplate?.category?.toLowerCase() || "business", {});
          const aiElements = elements.map((el, i) => ({ ...el, fontFamily: i === 0 ? design.fonts.title : design.fonts.body, color: design.colors[i % design.colors.length] }));
          setElements(aiElements);
          saveToHistory(aiElements);
          break;
        }
      }
    } catch (error) { console.error("AI Action error:", error); }
    setAiLoading(false);
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(posterRef.current, { useCORS: true, scale: 2, backgroundColor: null });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${selectedTemplate?.name || "poster"}-${Date.now()}.png`;
      link.click();
    } catch (err) { console.error("Download error:", err); }
    setLoading(false);
  };

  const savePosterToBackend = async () => {
    if (!posterRef.current) return;
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login to save posters!"); return; }
    setSaving(true);
    try {
      const canvas = await html2canvas(posterRef.current, { useCORS: true, scale: 2, backgroundColor: null });
      const imageBase64 = canvas.toDataURL("image/png");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posters/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ template: templateId || templateImage, category: selectedTemplate?.category || "Custom", text: elements.map(e => e.text).join(" | "), textColor: elements[0]?.color || "#000000", imageBase64 }),
      });
      const data = await res.json();
      if (res.ok) alert("Poster saved successfully!");
      else alert(data.error || "Failed to save");
    } catch (err) { console.error("Save error:", err); }
    setSaving(false);
  };

  const goBack = () => {
    navigate("/templates");
  };

  const getBackgroundStyle = () => {
    if (!selectedTemplate) return {};
    if (selectedTemplate.type === "gradient" || selectedTemplate.type === "pattern") return { background: selectedTemplate.backgroundStyle };
    return { backgroundImage: `url(${selectedTemplate.background || templateImage})`, backgroundSize: "cover", backgroundPosition: "center" };
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  if (showTemplateSelector) {
    return <TemplateSelector onSelect={handleSelectTemplate} onClose={goBack} />;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden animate-fadeIn">
      {/* Header */}
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Exit</span>
          </button>
          <div className="w-px h-5 bg-gray-600" />
          <h2 className="text-white font-medium text-sm">{selectedTemplate?.name || "Custom Poster"}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30"><Undo className="w-4 h-4" /></button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30"><Redo className="w-4 h-4" /></button>
          <div className="w-px h-5 bg-gray-600 mx-1" />
          <button onClick={downloadPoster} disabled={loading} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" />Download</button>
          <button onClick={savePosterToBackend} disabled={saving} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"><Save className="w-3.5 h-3.5" />Save</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-56 bg-gray-800 border-r border-gray-700 flex flex-col shrink-0">
          <div className="flex border-b border-gray-700">
            {[{ id: "text", icon: Type, label: "Text" }, { id: "ai", icon: Wand2, label: "AI" }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${activeTab === tab.id ? "text-purple-400 bg-gray-700/50" : "text-gray-400 hover:text-white"}`}>
                <tab.icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeTab === "text" && (
              <>
                <button onClick={addTextElement} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Text</button>
                {elements.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">Layers</p>
                    {elements.map((el, idx) => (
                      <div key={el.id} onClick={() => setSelectedElement(el.id)} className={`p-2 rounded cursor-pointer text-xs transition-all ${selectedElement === el.id ? "bg-purple-600/20 border border-purple-500" : "bg-gray-700/50 border border-transparent hover:border-gray-600"}`}>
                        <div className="flex items-center justify-between"><span className="text-gray-200 truncate">{el.text}</span><button onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }} className="text-gray-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button></div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {activeTab === "ai" && (
              <div className="space-y-2">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">Quick Actions</p>
                {[{ action: "autoLayout", icon: Layout, label: "Auto Layout" }, { action: "improveContrast", icon: Contrast, label: "Contrast" }, { action: "optimizeSizes", icon: Zap, label: "Sizes" }, { action: "suggestBetterFonts", icon: Type, label: "Fonts" }, { action: "generateColors", icon: Palette, label: "Colors" }].map((item) => (
                  <button key={item.action} onClick={() => handleAIAction(item.action)} disabled={aiLoading} className="w-full p-2 bg-gray-700/50 hover:bg-gray-700 rounded text-left text-xs text-gray-300 flex items-center gap-2 transition-colors"><item.icon className="w-3.5 h-3.5" />{item.label}</button>
                ))}
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Suggestions</p>
                  {getAISuggestions().slice(0, 3).map((s, i) => (
                    <button key={i} onClick={() => applyAISuggestion(s)} disabled={!selectedElement} className="w-full p-2 bg-gray-700/30 hover:bg-gray-700 rounded text-left text-xs text-gray-400 mb-1 line-clamp-2 disabled:opacity-50">{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="flex-1 bg-gray-900 overflow-auto flex items-center justify-center p-6">
          <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
            <div ref={posterRef} className="relative overflow-hidden shadow-2xl rounded-lg" style={{ width: selectedTemplate?.width || 400, height: selectedTemplate?.height || 500, ...getBackgroundStyle() }}>
              {elements.map((element) => (
                <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} bounds="parent" onStop={(e, data) => updateElement(element.id, { x: data.x, y: data.y })}>
                  <div className={`absolute cursor-move select-none ${selectedElement === element.id ? "ring-1 ring-purple-400 ring-offset-1 ring-offset-transparent" : ""}`} style={{ fontFamily: element.fontFamily, fontSize: `${element.fontSize}px`, fontWeight: element.fontWeight, color: element.color, textAlign: element.textAlign, maxWidth: "90%", transform: `rotate(${element.rotation}deg)`, opacity: element.opacity, left: 0, top: 0, textShadow: element.dropShadow ? "2px 2px 4px rgba(0,0,0,0.5)" : "none", letterSpacing: `${element.letterSpacing}px`, whiteSpace: "pre-wrap", backgroundColor: element.backgroundColor || "transparent", padding: element.padding || "0", borderRadius: element.borderRadius || "0", display: "inline-block" }} onClick={(e) => { e.stopPropagation(); setSelectedElement(element.id); }}>{element.text}</div>
                </Draggable>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-56 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-3">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Properties</p>
            {selectedElement && selectedElementData ? (
              <div className="space-y-3">
                <div><label className="text-gray-400 text-[10px] uppercase block mb-1">Text</label><textarea value={selectedElementData.text} onChange={(e) => updateElement(selectedElement, { text: e.target.value })} className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-xs resize-none" rows={2} /></div>
                <div><label className="text-gray-400 text-[10px] uppercase block mb-1">Font</label><select value={selectedElementData.fontFamily} onChange={(e) => updateElement(selectedElement, { fontFamily: e.target.value })} className="w-full p-1.5 bg-gray-700 border border-gray-600 rounded text-white text-xs">{FONTS.map((f) => (<option key={f.name} value={f.name} style={{ fontFamily: f.name }}>{f.label}</option>))}</select></div>
                <div><label className="text-gray-400 text-[10px] uppercase block mb-1">Size: {selectedElementData.fontSize}px</label><input type="range" min={8} max={72} value={selectedElementData.fontSize} onChange={(e) => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })} className="w-full accent-purple-500 h-1" /></div>
                <div><label className="text-gray-400 text-[10px] uppercase block mb-1">Color</label><div className="flex flex-wrap gap-1">{PRESET_COLORS.slice(0, 12).map((c) => (<button key={c} onClick={() => updateElement(selectedElement, { color: c })} className={`w-5 h-5 rounded border ${selectedElementData.color === c ? "border-white ring-1 ring-purple-400" : "border-gray-600"}`} style={{ backgroundColor: c }} />))}</div><input type="color" value={selectedElementData.color} onChange={(e) => updateElement(selectedElement, { color: e.target.value })} className="w-full h-6 mt-1 cursor-pointer rounded" /></div>
                <div><label className="text-gray-400 text-[10px] uppercase block mb-1">Alignment</label><div className="flex gap-1">{["left", "center", "right"].map((a) => (<button key={a} onClick={() => updateElement(selectedElement, { textAlign: a })} className={`flex-1 py-1 rounded text-xs capitalize ${selectedElementData.textAlign === a ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400"}`}>{a}</button>))}</div></div>
                <div className="flex gap-2"><label className="flex items-center gap-1.5 text-gray-400 text-[10px]"><input type="checkbox" checked={selectedElementData.fontWeight === "bold"} onChange={(e) => updateElement(selectedElement, { fontWeight: e.target.checked ? "bold" : "normal" })} className="accent-purple-500" />Bold</label><label className="flex items-center gap-1.5 text-gray-400 text-[10px]"><input type="checkbox" checked={selectedElementData.dropShadow} onChange={(e) => updateElement(selectedElement, { dropShadow: e.target.checked })} className="accent-purple-500" />Shadow</label></div>
                <button onClick={() => deleteElement(selectedElement)} className="w-full py-1.5 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30">Delete</button>
              </div>
            ) : <p className="text-gray-500 text-xs text-center py-4">Select an element</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateSelector = ({ onSelect, onClose }) => {
  const [category, setCategory] = useState("all");
  const categories = ["all", "Birthday", "Business", "Sale", "Wedding", "Festivals"];
  const filteredTemplates = category === "all" ? editableTemplates : editableTemplates.filter(t => t.category === category);

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50 overflow-hidden animate-fadeIn">
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h2 className="text-white font-medium">Choose Template</h2>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((cat) => (<button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${category === cat ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>{cat === "all" ? "All" : cat}</button>))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredTemplates.map((template) => (
            <button key={template.id} onClick={() => onSelect(template)} className="group relative aspect-[2/3] rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all hover:scale-105">
              <div className="w-full h-full" style={template.type === "gradient" || template.type === "pattern" || template.type === "solid" ? { background: template.backgroundStyle, backgroundColor: template.backgroundColor } : { backgroundImage: `url(${template.background})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-sm font-medium">Use</span></div>
              <div className="absolute top-1 left-1 text-[8px] px-1.5 py-0.5 rounded bg-black/50 text-white">{template.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomizePoster;
