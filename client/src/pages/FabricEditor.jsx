import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Save, Download, Loader } from "lucide-react";
import axios from "axios";
import CanvasEditor from "../components/editor/CanvasEditor";
import Toolbar from "../components/editor/Toolbar";
import PropertiesPanel from "../components/editor/PropertiesPanel";
import LayerPanel from "../components/editor/LayerPanel";
import EditorSidebar from "../components/editor/EditorSidebar";
import { fabricTemplates, getFabricTemplateById } from "../data/fabricTemplates";
import { DESIGN_TEMPLATES } from "../data/designTemplates";

const FabricEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const templateId = params.get("id");

  const [template, setTemplate] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [canvasApi, setCanvasApi] = useState(null);
  const [zoom, setZoom] = useState(0.5);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activePanel, setActivePanel] = useState("properties");
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // Load template
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) {
        setTemplate(DESIGN_TEMPLATES[0]);
        return;
      }

      // Check DESIGN_TEMPLATES first
      const designTmpl = DESIGN_TEMPLATES.find(t => t._id === templateId);
      if (designTmpl) {
        setTemplate(designTmpl);
        return;
      }

      // Check if it's a MongoDB ID (24 hex chars) or old template ID
      const isMongoId = /^[a-fA-F0-9]{24}$/.test(templateId);
      
      if (isMongoId) {
        // Load from API
        setLoadingTemplate(true);
        try {
          const response = await axios.get(`/api/templates/${templateId}/canvas`);
          if (response.data.success) {
            setTemplate({
              name: response.data.data.name,
              category: response.data.data.category,
              canvas: response.data.data.dimensions,
              backgroundColor: response.data.data.background,
              canvasData: response.data.data.canvasData,
              _id: templateId,
              isFromApi: true
            });
          }
        } catch (error) {
          console.error("Error loading template from API:", error);
          const tmpl = getFabricTemplateById(templateId);
          if (tmpl) setTemplate(tmpl);
        } finally {
          setLoadingTemplate(false);
        }
      } else {
        // Load from hardcoded templates
        const tmpl = getFabricTemplateById(templateId);
        if (tmpl) {
          setTemplate(tmpl);
        } else {
          setTemplate(DESIGN_TEMPLATES[0]);
        }
      }
    };

    loadTemplate();
  }, [templateId, location.key]);

  useEffect(() => {
    if (canvasApi && template?.isFromApi && template?.canvasData) {
      canvasApi.loadFromCanvasJSON(template.canvasData);
    }
  }, [canvasApi, template]);

  // Handle canvas ready
  const handleCanvasReady = (api) => {
    setCanvasApi(api);
    saveToHistory(api.exportAsJSON());
  };

  // Handle sidebar template selection
  const handleSelectTemplate = (templateData) => {
    if (templateData && canvasApi) {
      setTemplate(templateData);
      
      // Check if it's from API (has canvasData) or DESIGN_TEMPLATE (has backgroundImage)
      if (templateData.canvasData) {
        canvasApi.loadFromCanvasJSON(templateData.canvasData);
      } else if (templateData.objects) {
        // Hardcoded template - use objects format
        canvasApi.loadFromJSON({
          version: "5.3.0",
          objects: templateData.objects,
          background: templateData.backgroundColor || templateData.canvas?.backgroundColor || '#ffffff',
          width: templateData.canvas?.width || 1080,
          height: templateData.canvas?.height || 1080,
        });
      } else if (templateData.backgroundImage) {
        // DESIGN_TEMPLATES - load with just background as fallback
        canvasApi.loadFromJSON({
          version: "5.3.0",
          objects: [],
          background: templateData.backgroundColor || '#1e293b',
          width: 1080,
          height: 1080,
        });
      } else {
        // Empty canvas
        canvasApi.loadFromJSON({
          version: "5.3.0",
          objects: [],
          background: '#ffffff',
        });
      }
    }
  };

  // Handle sidebar text
  const handleSidebarAddText = (text = 'New Text', options = {}) => {
    if (canvasApi) {
      canvasApi.addText(text, options);
    }
  };

  // Handle sidebar shape
  const handleSidebarAddShape = (shapeType) => {
    if (canvasApi) {
      canvasApi.addShape(shapeType);
    }
  };

  // Handle sidebar image
  const handleSidebarAddImage = (url) => {
    if (canvasApi && url) {
      canvasApi.addImage(url);
    }
  };

  // Handle selection change
  const handleSelectionChange = (obj) => {
    setSelectedObject(obj);
  };

  // Handle object modification
  const handleObjectModified = useCallback((obj) => {
    if (canvasApi) {
      saveToHistory(canvasApi.exportAsJSON());
    }
  }, [canvasApi]);

  // Handle property update
  const handlePropertyUpdate = (updates) => {
    if (!selectedObject || !canvas) return;

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
    if (updates.src !== undefined) {
      // Handle image replacement
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const fabricImg = selectedObject;
        fabricImg.setElement(img);
        canvas.renderAll();
      };
      img.src = updates.src;
    }

    canvas.renderAll();
    handleObjectModified(selectedObject);
  };

  // History management
  const saveToHistory = (json) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0 && canvas) {
      const prevState = JSON.parse(history[historyIndex - 1]);
      canvas.loadFromJSON(prevState).then(() => {
        canvas.renderAll();
        setHistoryIndex(historyIndex - 1);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && canvas) {
      const nextState = JSON.parse(history[historyIndex + 1]);
      canvas.loadFromJSON(nextState).then(() => {
        canvas.renderAll();
        setHistoryIndex(historyIndex + 1);
      });
    }
  };

  // Export PNG
  const handleExportPNG = () => {
    if (!canvasApi) return;
    const dataURL = canvasApi.exportAsPNG(2);
    const link = document.createElement("a");
    link.download = `${template?.name || 'poster'}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  // Export JPG
  const handleExportJPG = () => {
    if (!canvasApi) return;
    const dataURL = canvasApi.exportAsJPG(2);
    const link = document.createElement("a");
    link.download = `${template?.name || 'poster'}-${Date.now()}.jpg`;
    link.href = dataURL;
    link.click();
  };

  // Export JSON
  const handleExportJSON = () => {
    if (!canvasApi) return;
    const json = canvasApi.exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement("a");
    link.download = `${template?.name || 'poster'}-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  // Drawing mode handlers
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

  // Transform handlers
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

  // Export PDF
  const handleExportPDF = () => {
    if (!canvasApi) return;
    const dataURL = canvasApi.exportAsPNG();
    const img = new Image();
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height],
      });
      pdf.addImage(dataURL, 'PNG', 0, 0, img.width, img.height);
      pdf.save(`${template?.name || 'poster'}-${Date.now()}.pdf`);
    };
    img.src = dataURL;
  };

  const goBack = () => {
    navigate("/templates");
  };

  if (!template || loadingTemplate) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading template...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
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
          <h2 className="text-white font-medium text-sm">{template.name}</h2>
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
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-2 py-1 text-gray-400 hover:text-white text-xs disabled:opacity-30"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="px-2 py-1 text-gray-400 hover:text-white text-xs disabled:opacity-30"
          >
            Redo
          </button>
          <div className="w-px h-5 bg-gray-600 mx-1" />
          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />PDF
          </button>
          <button
            onClick={handleExportPNG}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />PNG
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />JSON
          </button>
        </div>
      </header>

      {/* Toolbar */}
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
        onExportJPG={handleExportJPG}
        onExportJSON={handleExportJSON}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        selectedObject={selectedObject}
        isDrawingMode={isDrawingMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
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

        {/* Layer Panel */}
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
              canvas={canvas}
              selectedObject={selectedObject}
              onSelectionChange={setSelectedObject}
            />
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-900">
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
            <CanvasEditor
              template={template}
              onCanvasReady={setCanvas}
              onSelectionChange={handleSelectionChange}
              onObjectModified={handleObjectModified}
              zoom={1}
            />
          </div>
        </div>

        {/* Properties Panel */}
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

      {/* Zoom Controls */}
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
    </div>
  );
};

export default FabricEditor;