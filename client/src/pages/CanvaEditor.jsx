import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, Download, Undo, Redo, ZoomIn, ZoomOut, Layers, Trash2, Copy, Minus, Plus } from "lucide-react";
import * as fabric from "fabric";
import templateLibrary from "../data/template-library.json";
import CanvaToolbar from "../components/editor/CanvaToolbar";
import CanvaSidebar from "../components/editor/CanvaSidebar";
import CanvaBottomBar from "../components/editor/CanvaBottomBar";

const FONTS = [
  { name: "Poppins", label: "Poppins" },
  { name: "Montserrat", label: "Montserrat" },
  { name: "Playfair Display", label: "Playfair Display" },
  { name: "Anton", label: "Anton" },
  { name: "Pacifico", label: "Pacifico" },
  { name: "Roboto", label: "Roboto" },
  { name: "Cormorant Garamond", label: "Cormorant Garamond" },
];

const CanvaEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("id");

  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const [selectedObject, setSelectedObject] = useState(null);
  const [zoom, setZoom] = useState(50);
  const [canvasReady, setCanvasReady] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("templates");
  const [autoSaved, setAutoSaved] = useState(true);
  const [template, setTemplate] = useState(null);

  // Load template
  useEffect(() => {
    if (templateId) {
      const tmpl = templateLibrary.templates.find(t => t.id === templateId);
      if (tmpl) {
        setTemplate(tmpl);
      }
    } else if (templateLibrary.templates.length > 0) {
      setTemplate(templateLibrary.templates[0]);
    }
  }, [templateId]);

  // Initialize canvas
  useEffect(() => {
    if (!template || !canvasRef.current) return;

    // Destroy existing canvas
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: template.dimensions?.width || 1080,
      height: template.dimensions?.height || 1080,
      backgroundColor: template.background_color || "#ffffff",
      preserveObjectStacking: true,
      selection: true,
    });

    // Configure object controls
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: "#ffffff",
      cornerStrokeColor: "#6366f1",
      cornerSize: 12,
      padding: 5,
      cornerStyle: "circle",
      borderColor: "#6366f1",
      borderScaleFactor: 2,
    });

    fabricCanvasRef.current = canvas;
    setCanvasReady(true);

    // Load template objects
    if (template.canvas?.objects) {
      loadTemplateObjects(canvas, template.canvas.objects);
    }

    // Event listeners
    const handleSelection = () => {
      const active = canvas.getActiveObject();
      setSelectedObject(active);
    };

    const handleModified = () => {
      saveToHistory(canvas.toJSON(["id", "customType"]));
      setAutoSaved(false);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedObject(null));
    canvas.on("object:modified", handleModified);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared");
      canvas.off("object:modified", handleModified);
    };
  }, [template]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (fabricCanvasRef.current && canvasReady) {
        const json = fabricCanvasRef.current.toJSON(["id", "customType"]);
        localStorage.setItem("posterhub_autosave", JSON.stringify(json));
        setAutoSaved(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [canvasReady]);

  const loadTemplateObjects = async (canvas, objects) => {
    const loadPromises = objects.map(async (obj) => {
      try {
        let fabricObject;

        switch (obj.type) {
          case "text":
            fabricObject = new fabric.Text(obj.text, {
              left: obj.left,
              top: obj.top,
              originX: obj.originX || "left",
              originY: obj.originY || "top",
              fontFamily: obj.fontFamily || "Poppins",
              fontSize: obj.fontSize || 24,
              fill: obj.fill || "#000000",
              opacity: obj.opacity || 1,
            });
            break;

          case "rect":
            fabricObject = new fabric.Rect({
              left: obj.left,
              top: obj.top,
              originX: obj.originX || "left",
              originY: obj.originY || "top",
              width: obj.width || 100,
              height: obj.height || 100,
              fill: obj.fill || "#cccccc",
              opacity: obj.opacity || 1,
              rx: obj.rx || 0,
              ry: obj.ry || 0,
            });
            break;

          case "circle":
            fabricObject = new fabric.Circle({
              left: obj.left,
              top: obj.top,
              originX: obj.originX || "left",
              originY: obj.originY || "top",
              radius: obj.radius || 50,
              fill: obj.fill || "#cccccc",
              opacity: obj.opacity || 1,
            });
            break;

          default:
            return null;
        }

        if (fabricObject && obj.id) {
          fabricObject.set("id", obj.id);
          fabricObject.set("customType", obj.type);
        }

        return fabricObject;
      } catch (err) {
        console.error("Error loading object:", err);
        return null;
      }
    });

    const loadedObjects = await Promise.all(loadPromises);
    loadedObjects.forEach(obj => {
      if (obj) canvas.add(obj);
    });

    canvas.renderAll();
    saveToHistory(canvas.toJSON(["id", "customType"]));
  };

  const saveToHistory = (json) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  };

  const addText = useCallback((text = "New Text", options = {}) => {
    if (!fabricCanvasRef.current) return;

    const textObj = new fabric.Text(text, {
      left: template?.dimensions?.width / 2 || 540,
      top: template?.dimensions?.height / 2 || 540,
      originX: "center",
      originY: "center",
      fontFamily: "Poppins",
      fontSize: 24,
      fill: "#000000",
      ...options,
    });

    textObj.set("id", `text-${Date.now()}`);
    textObj.set("customType", "text");

    fabricCanvasRef.current.add(textObj);
    fabricCanvasRef.current.setActiveObject(textObj);
    fabricCanvasRef.current.renderAll();
    saveToHistory(fabricCanvasRef.current.toJSON(["id", "customType"]));
    setAutoSaved(false);
  }, [template]);

  const addShape = useCallback((shapeType = "rect", options = {}) => {
    if (!fabricCanvasRef.current) return;

    const defaults = {
      left: template?.dimensions?.width / 2 || 540,
      top: template?.dimensions?.height / 2 || 540,
      originX: "center",
      originY: "center",
      fill: "#6366f1",
      ...options,
    };

    let shape;
    switch (shapeType) {
      case "circle":
        shape = new fabric.Circle({ ...defaults, radius: 50 });
        break;
      case "triangle":
        shape = new fabric.Triangle({ ...defaults, width: 100, height: 100 });
        break;
      default:
        shape = new fabric.Rect({ ...defaults, width: 100, height: 100 });
    }

    shape.set("id", `${shapeType}-${Date.now()}`);
    shape.set("customType", shapeType);

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.renderAll();
    saveToHistory(fabricCanvasRef.current.toJSON(["id", "customType"]));
    setAutoSaved(false);
  }, [template]);

  const addImage = useCallback((url) => {
    if (!fabricCanvasRef.current || !url) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const fabricImg = new fabric.Image(img, {
        left: template?.dimensions?.width / 2 || 540,
        top: template?.dimensions?.height / 2 || 540,
        originX: "center",
        originY: "center",
      });

      fabricImg.set("id", `image-${Date.now()}`);
      fabricImg.set("customType", "image");

      fabricCanvasRef.current.add(fabricImg);
      fabricCanvasRef.current.setActiveObject(fabricImg);
      fabricCanvasRef.current.renderAll();
      saveToHistory(fabricCanvasRef.current.toJSON(["id", "customType"]));
    };
    img.src = url;
  }, [template]);

  const deleteSelected = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const active = fabricCanvasRef.current.getActiveObject();
    if (active) {
      fabricCanvasRef.current.remove(active);
      fabricCanvasRef.current.renderAll();
      setSelectedObject(null);
      saveToHistory(fabricCanvasRef.current.toJSON(["id", "customType"]));
      setAutoSaved(false);
    }
  }, []);

  const duplicateSelected = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const active = fabricCanvasRef.current.getActiveObject();
    if (active) {
      active.clone((cloned) => {
        cloned.set({
          left: active.left + 20,
          top: active.top + 20,
          id: `${active.id}-copy`,
        });
        fabricCanvasRef.current.add(cloned);
        fabricCanvasRef.current.setActiveObject(cloned);
        fabricCanvasRef.current.renderAll();
        saveToHistory(fabricCanvasRef.current.toJSON(["id", "customType"]));
      });
    }
  }, []);

  const bringForward = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const active = fabricCanvasRef.current.getActiveObject();
    if (active) {
      fabricCanvasRef.current.bringForward(active);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const sendBackward = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const active = fabricCanvasRef.current.getActiveObject();
    if (active) {
      fabricCanvasRef.current.sendBackwards(active);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const updateSelectedObject = useCallback((updates) => {
    if (!selectedObject || !fabricCanvasRef.current) return;

    Object.keys(updates).forEach(key => {
      selectedObject.set(key, updates[key]);
    });

    fabricCanvasRef.current.renderAll();
    saveToHistory(fabricCanvasRef.current.toJSON(["id", "customType"]));
    setAutoSaved(false);
  }, [selectedObject]);

  const exportAsPNG = useCallback(() => {
    if (!fabricCanvasRef.current) return null;
    return fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
  }, []);

  const handleExport = () => {
    const dataURL = exportAsPNG();
    if (dataURL) {
      const link = document.createElement("a");
      link.download = `${template?.name || "design"}-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const handleSave = () => {
    if (fabricCanvasRef.current) {
      const json = fabricCanvasRef.current.toJSON(["id", "customType"]);
      localStorage.setItem("posterhub_autosave", JSON.stringify(json));
      setAutoSaved(true);
    }
  };

  const undo = () => {
    if (historyIndex > 0 && fabricCanvasRef.current) {
      const prevState = JSON.parse(history[historyIndex - 1]);
      fabricCanvasRef.current.loadFromJSON(prevState).then(() => {
        fabricCanvasRef.current.renderAll();
        setHistoryIndex(historyIndex - 1);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && fabricCanvasRef.current) {
      const nextState = JSON.parse(history[historyIndex + 1]);
      fabricCanvasRef.current.loadFromJSON(nextState).then(() => {
        fabricCanvasRef.current.renderAll();
        setHistoryIndex(historyIndex + 1);
      });
    }
  };

  const handleZoom = (newZoom) => {
    setZoom(newZoom);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(newZoom / 100);
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleTemplateSelect = (tmpl) => {
    setTemplate(tmpl);
    if (fabricCanvasRef.current && tmpl.canvas?.objects) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.setBackgroundColor(tmpl.background_color || "#ffffff", () => {
        loadTemplateObjects(fabricCanvasRef.current, tmpl.canvas.objects);
      });
    }
  };

  if (!template) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/templates")}
            className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Exit</span>
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <h1 className="text-lg font-semibold text-slate-800">{template.name}</h1>
          <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded">
            {template.dimensions?.width} x {template.dimensions?.height}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40"
          >
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {showSidebar && (
          <CanvaSidebar
            activeTab={activeSidebarTab}
            onTabChange={setActiveSidebarTab}
            onAddText={addText}
            onAddShape={addShape}
            onAddImage={addImage}
            onSelectTemplate={handleTemplateSelect}
            currentTemplates={templateLibrary.templates}
          />
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-slate-100 p-8">
          <div
            ref={containerRef}
            className="relative bg-white shadow-xl"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center",
              width: template.dimensions?.width || 1080,
              height: template.dimensions?.height || 1080,
            }}
          >
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <CanvaBottomBar
        zoom={zoom}
        onZoomChange={handleZoom}
        dimensions={template.dimensions}
        autoSaved={autoSaved}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
      />
    </div>
  );
};

export default CanvaEditor;