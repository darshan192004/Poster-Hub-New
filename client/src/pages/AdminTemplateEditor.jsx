import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Download, Eye, Image as ImageIcon, Loader } from "lucide-react";
import CanvasEditor from "../components/editor/CanvasEditor";
import Toolbar from "../components/editor/Toolbar";
import PropertiesPanel from "../components/editor/PropertiesPanel";
import LayerPanel from "../components/editor/LayerPanel";
import EditorSidebar from "../components/editor/EditorSidebar";
import { fabricTemplates, getFabricTemplateById } from "../data/fabricTemplates";
import axios from "axios";

const AdminTemplateEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const templateId = params.id;
  
  const [template, setTemplate] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [canvasApi, setCanvasApi] = useState(null);
  const [zoom, setZoom] = useState(0.5);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activePanel, setActivePanel] = useState("properties");
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState("");
  
  const [templateData, setTemplateData] = useState({
    name: "",
    category: "Social Media",
    subcategory: "",
    tags: "",
    isFeatured: false,
    isPremium: false,
  });

  useEffect(() => {
    if (templateId) {
      const tmpl = getFabricTemplateById(templateId);
      if (tmpl) {
        setTemplate(tmpl);
      }
    } else {
      setTemplate(fabricTemplates[0]);
    }
  }, [templateId]);

  useEffect(() => {
    if (canvasApi) {
      saveToHistory(canvasApi.exportAsJSON());
    }
  }, [canvasApi]);

  const handleCanvasReady = (api) => {
    setCanvasApi(api);
  };

  const handleSelectTemplate = (templateData) => {
    if (templateData) {
      setTemplate(templateData);
      if (canvasApi) {
        canvasApi.loadFromJSON({
          version: "5.3.0",
          objects: templateData.objects || [],
          background: templateData.backgroundColor || '#ffffff',
        });
      }
    }
  };

  const handleSidebarAddText = (text = 'New Text', options = {}) => {
    if (canvasApi) {
      canvasApi.addText(text, options);
    }
  };

  const handleSidebarAddShape = (shapeType) => {
    if (canvasApi) {
      canvasApi.addShape(shapeType);
    }
  };

  const handleSidebarAddImage = (url) => {
    if (canvasApi && url) {
      canvasApi.addImage(url);
    }
  };

  const handleSelectionChange = (obj) => {
    setSelectedObject(obj);
  };

  const handleObjectModified = useCallback((obj) => {
    if (canvasApi) {
      saveToHistory(canvasApi.exportAsJSON());
    }
  }, [canvasApi]);

  const handlePropertyUpdate = (updates) => {
    if (!selectedObject || !canvasApi) return;

    if (updates.text !== undefined) {
      selectedObject.set('text', updates.text);
    }
    if (updates.fontFamily !== undefined) {
      selectedObject.set('fontFamily', updates.fontFamily);
    }
    if (updates.fontSize !== undefined) {
      selectedObject.set('fontSize', updates.fontSize);
    }
    if (updates.fontWeight !== undefined) {
      selectedObject.set('fontWeight', updates.fontWeight);
    }
    if (updates.fill !== undefined) {
      selectedObject.set('fill', updates.fill);
    }
    if (updates.textAlign !== undefined) {
      selectedObject.set('textAlign', updates.textAlign);
    }
    if (updates.opacity !== undefined) {
      selectedObject.set('opacity', updates.opacity);
    }

    canvasApi.getCanvas().renderAll();
    handleObjectModified(selectedObject);
  };

  const saveToHistory = (json) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0 && canvasApi) {
      const prevState = JSON.parse(history[historyIndex - 1]);
      canvasApi.loadFromJSON(prevState).then(() => {
        canvasApi.getCanvas().renderAll();
        setHistoryIndex(historyIndex - 1);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && canvasApi) {
      const nextState = JSON.parse(history[historyIndex + 1]);
      canvasApi.loadFromJSON(nextState).then(() => {
        canvasApi.getCanvas().renderAll();
        setHistoryIndex(historyIndex + 1);
      });
    }
  };

  const handleEnableDrawing = () => {
    if (canvasApi) {
      canvasApi.enableDrawingMode('#000000', 2);
      setIsDrawingMode(true);
    }
  };

  const handleDisableDrawing = () => {
    if (canvasApi) {
      canvasApi.disableDrawingMode();
      setIsDrawingMode(false);
    }
  };

  const handleFlipHorizontal = () => {
    if (canvasApi) canvasApi.flipHorizontal();
  };

  const handleFlipVertical = () => {
    if (canvasApi) canvasApi.flipVertical();
  };

  const handleLockObject = () => {
    if (canvasApi) canvasApi.lockObject();
  };

  const handleUnlockObject = () => {
    if (canvasApi) canvasApi.unlockObject();
  };

  const handleExportPNG = () => {
    if (!canvasApi) return;
    const dataURL = canvasApi.exportAsPNG(2);
    const link = document.createElement("a");
    link.download = `${template?.name || 'template'}-preview.png`;
    link.href = dataURL;
    link.click();
  };

  const handleExportJSON = () => {
    if (!canvasApi) return;
    const json = canvasApi.exportAsJSONWithDims();
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement("a");
    link.download = `${template?.name || 'template'}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const openSaveModal = () => {
    setShowSaveModal(true);
  };

  const handleSaveTemplate = async () => {
    if (!canvasApi || !templateData.name || !templateData.category) {
      alert("Please fill in required fields");
      return;
    }

    setSaving(true);
    setSavingMessage("Generating thumbnail...");

    try {
      const canvasData = canvasApi.exportAsJSONWithDims();
      const dimensions = canvasApi.getDimensions();
      const thumbnail = canvasApi.exportAsPNG(1);

      setSavingMessage("Saving template to database...");

      const response = await axios.post("/api/templates/save", {
        name: templateData.name,
        category: templateData.category,
        subcategory: templateData.subcategory || undefined,
        tags: templateData.tags ? templateData.tags.split(',').map(t => t.trim()) : [],
        canvasData: JSON.parse(canvasData),
        dimensions,
        thumbnail,
        isFeatured: templateData.isFeatured,
        isPremium: templateData.isPremium,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSavingMessage("Template saved successfully!");
      
      setTimeout(() => {
        setShowSaveModal(false);
        setSaving(false);
        navigate("/admin/templates");
      }, 1000);
    } catch (error) {
      console.error("Error saving template:", error);
      setSavingMessage("Error saving template");
      setSaving(false);
    }
  };

  const goBack = () => {
    navigate("/admin");
  };

  if (!template) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading template...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden">
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Exit</span>
          </button>
          <div className="w-px h-5 bg-gray-600" />
          <h2 className="text-white font-medium text-sm">Admin Template Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`px-3 py-1.5 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              showSidebar ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {showSidebar ? 'Hide' : 'Show'} Library
          </button>
          <div className="w-px h-5 bg-gray-600 mx-1" />
          <button
            onClick={handleExportPNG}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />Preview
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />JSON
          </button>
          <button
            onClick={openSaveModal}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />Save Template
          </button>
        </div>
      </header>

      <Toolbar
        onAddText={() => canvasApi?.addText?.()}
        onAddImage={(url) => canvasApi?.addImage?.(url)}
        onAddShape={(shape) => canvasApi?.addShape?.(shape)}
        onAddLine={() => canvasApi?.addLine?.()}
        onAddArrow={() => canvasApi?.addArrow?.()}
        onAddPolygon={(sides) => canvasApi?.addPolygon?.(sides)}
        onEnableDrawing={handleEnableDrawing}
        onDisableDrawing={handleDisableDrawing}
        onDelete={() => canvasApi?.deleteActiveObject?.()}
        onDuplicate={() => canvasApi?.duplicateActiveObject?.()}
        onBringForward={() => canvasApi?.bringForward?.()}
        onSendBackward={() => canvasApi?.sendBackward?.()}
        onFlipHorizontal={handleFlipHorizontal}
        onFlipVertical={handleFlipVertical}
        onLockObject={handleLockObject}
        onUnlockObject={handleUnlockObject}
        onExportPNG={handleExportPNG}
        onExportJSON={handleExportJSON}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        selectedObject={selectedObject}
        isDrawingMode={isDrawingMode}
      />

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <EditorSidebar
            onAddText={handleSidebarAddText}
            onAddImage={handleSidebarAddImage}
            onAddShape={handleSidebarAddShape}
            onSelectTemplate={handleSelectTemplate}
            searchQuery={sidebarSearch}
            onSearchChange={setSidebarSearch}
          />
        )}

        <div className="flex flex-col border-r border-gray-700">
          <button
            onClick={() => setActivePanel("layers")}
            className={`px-3 py-2 text-xs font-medium ${
              activePanel === "layers"
                ? "text-purple-400 bg-gray-700/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Layers
          </button>
          {activePanel === "layers" && (
            <LayerPanel
              canvas={canvasApi?.getCanvas?.()}
              selectedObject={selectedObject}
              onSelectionChange={setSelectedObject}
            />
          )}
        </div>

        <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-900">
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <CanvasEditor
              template={template}
              onCanvasReady={handleCanvasReady}
              onSelectionChange={handleSelectionChange}
              onObjectModified={handleObjectModified}
              zoom={1}
            />
          </div>
        </div>

        <div className="flex flex-col border-l border-gray-700">
          <button
            onClick={() => setActivePanel("properties")}
            className={`px-3 py-2 text-xs font-medium ${
              activePanel === "properties"
                ? "text-purple-400 bg-gray-700/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Properties
          </button>
          {activePanel === "properties" && (
            <PropertiesPanel
              selectedObject={selectedObject}
              onUpdate={handlePropertyUpdate}
              onClose={() => setSelectedObject(null)}
            />
          )}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-gray-800 rounded-lg p-2">
        <button
          onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
          className="px-2 py-1 text-white text-xs hover:bg-gray-700 rounded"
        >
          -
        </button>
        <span className="text-white text-xs">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.25))}
          className="px-2 py-1 text-white text-xs hover:bg-gray-700 rounded"
        >
          +
        </button>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Save Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Template Name *</label>
                <input
                  type="text"
                  value={templateData.name}
                  onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Category *</label>
                <select
                  value={templateData.category}
                  onChange={(e) => setTemplateData({ ...templateData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Social Media">Social Media</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Personal">Personal</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Subcategory</label>
                <input
                  type="text"
                  value={templateData.subcategory}
                  onChange={(e) => setTemplateData({ ...templateData, subcategory: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Instagram Post"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={templateData.tags}
                  onChange={(e) => setTemplateData({ ...templateData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., modern, bold, colorful"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-400 text-sm">
                  <input
                    type="checkbox"
                    checked={templateData.isFeatured}
                    onChange={(e) => setTemplateData({ ...templateData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-gray-400 text-sm">
                  <input
                    type="checkbox"
                    checked={templateData.isPremium}
                    onChange={(e) => setTemplateData({ ...templateData, isPremium: e.target.checked })}
                    className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                  />
                  Premium
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {savingMessage}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplateEditor;