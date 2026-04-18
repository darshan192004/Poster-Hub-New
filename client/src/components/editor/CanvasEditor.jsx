import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';

const CanvasEditor = ({ 
  template, 
  onCanvasReady, 
  onSelectionChange, 
  onObjectModified,
  zoom = 1 
}) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || !template) return;

    // Destroy existing canvas if any
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: template.canvas?.width || 800,
      height: template.canvas?.height || 600,
      backgroundColor: template.canvas?.backgroundColor || '#ffffff',
      preserveObjectStacking: true,
      selection: true,
    });

    // Enable object controls styling
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#ffffff',
      cornerStrokeColor: '#6366f1',
      cornerSize: 12,
      padding: 5,
      cornerStyle: 'circle',
      borderColor: '#6366f1',
      borderScaleFactor: 2,
    });

    // Configure custom controls
    fabric.Object.prototype.controls = {
      ...fabric.Object.prototype.controls,
      mt: new fabric.Control({ 
        mouseActionHandler: fabric.Control.prototype.handleAction,
        cursorStyle: 'n-resize',
        position: 'top'
      }),
      mb: new fabric.Control({ 
        mouseActionHandler: fabric.Control.prototype.handleAction,
        cursorStyle: 's-resize',
        position: 'bottom'
      }),
      ml: new fabric.Control({ 
        mouseActionHandler: fabric.Control.prototype.handleAction,
        cursorStyle: 'w-resize',
        position: 'left'
      }),
      mr: new fabric.Control({ 
        mouseActionHandler: fabric.Control.prototype.handleAction,
        cursorStyle: 'e-resize',
        position: 'right'
      }),
    };

    fabricCanvasRef.current = canvas;
    setCanvasReady(true);

    // Load template objects
    loadTemplateObjects(canvas, template);

    // Event listeners
    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      onSelectionChange?.(activeObject);
    };

    const handleModified = () => {
      const activeObject = canvas.getActiveObject();
      onObjectModified?.(activeObject);
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelection);
    canvas.on('object:modified', handleModified);
    canvas.on('object:moving', handleModified);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelection);
      canvas.off('object:modified', handleModified);
      canvas.off('object:moving', handleModified);
    };
  }, [template]);

  // Update zoom when changed
  useEffect(() => {
    if (fabricCanvasRef.current && canvasReady) {
      fabricCanvasRef.current.setZoom(zoom);
      fabricCanvasRef.current.renderAll();
    }
  }, [zoom, canvasReady]);

  const loadTemplateObjects = async (canvas, template) => {
    if (!template.objects || !template.objects.length) return;

    const loadPromises = template.objects.map(async (obj) => {
      try {
        let fabricObject;

        switch (obj.type) {
          case 'text':
            fabricObject = new fabric.Text(obj.text, {
              left: obj.left,
              top: obj.top,
              originX: obj.originX || 'left',
              originY: obj.originY || 'top',
              fontFamily: obj.fontFamily || 'Poppins',
              fontSize: obj.fontSize || 24,
              fontWeight: obj.fontWeight || 'normal',
              fontStyle: obj.fontStyle || 'normal',
              fill: obj.fill || '#000000',
              stroke: obj.stroke,
              strokeWidth: obj.strokeWidth,
              textAlign: obj.textAlign || 'left',
              shadow: obj.shadow ? new fabric.Shadow({
                color: obj.shadow.color || 'rgba(0,0,0,0.5)',
                blur: obj.shadow.blur || 10,
                offsetX: obj.shadow.offsetX || 0,
                offsetY: obj.shadow.offsetY || 0,
              }) : null,
              letterSpacing: obj.letterSpacing || 0,
              backgroundColor: obj.backgroundColor,
              padding: obj.padding || 0,
              rx: obj.borderRadius || 0,
              ry: obj.borderRadius || 0,
            });
            break;

          case 'image':
            if (obj.src) {
              fabricObject = await new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                  const fabricImg = new fabric.Image(img, {
                    left: obj.left,
                    top: obj.top,
                    originX: obj.originX || 'left',
                    originY: obj.originY || 'top',
                    scaleX: obj.scaleX || 1,
                    scaleY: obj.scaleY || 1,
                  });
                  if (obj.width) fabricImg.set('width', obj.width);
                  if (obj.height) fabricImg.set('height', obj.height);
                  resolve(fabricImg);
                };
                img.onerror = reject;
                img.src = obj.src;
              });
            }
            break;

          case 'rect':
            fabricObject = new fabric.Rect({
              left: obj.left,
              top: obj.top,
              originX: obj.originX || 'left',
              originY: obj.originY || 'top',
              width: obj.width || 100,
              height: obj.height || 100,
              fill: obj.fill || '#cccccc',
              stroke: obj.stroke,
              strokeWidth: obj.strokeWidth || 0,
              rx: obj.rx || 0,
              ry: obj.ry || 0,
            });
            break;

          case 'circle':
            fabricObject = new fabric.Circle({
              left: obj.left,
              top: obj.top,
              originX: obj.originX || 'left',
              originY: obj.originY || 'top',
              radius: obj.radius || 50,
              fill: obj.fill || '#cccccc',
              stroke: obj.stroke,
              strokeWidth: obj.strokeWidth || 0,
            });
            break;

          case 'triangle':
            fabricObject = new fabric.Triangle({
              left: obj.left,
              top: obj.top,
              originX: obj.originX || 'left',
              originY: obj.originY || 'top',
              width: obj.width || 100,
              height: obj.height || 100,
              fill: obj.fill || '#cccccc',
              stroke: obj.stroke,
              strokeWidth: obj.strokeWidth || 0,
            });
            break;

          default:
            return null;
        }

        if (fabricObject) {
          fabricObject.set('id', obj.id);
          fabricObject.set('customType', obj.type);
        }

        return fabricObject;
      } catch (err) {
        console.error('Error loading object:', err);
        return null;
      }
    });

    const objects = await Promise.all(loadPromises);
    objects.forEach(obj => {
      if (obj) canvas.add(obj);
    });

    canvas.renderAll();
    onCanvasReady?.(canvas);
  };

  // Public methods exposed to parent
  const addText = useCallback((text = 'New Text', options = {}) => {
    if (!fabricCanvasRef.current) return;
    
    const textObj = new fabric.Text(text, {
      left: template.canvas?.width / 2 || 400,
      top: template.canvas?.height / 2 || 300,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Poppins',
      fontSize: 24,
      fill: '#000000',
      ...options,
    });
    
    textObj.set('id', `text-${Date.now()}`);
    textObj.set('customType', 'text');
    
    fabricCanvasRef.current.add(textObj);
    fabricCanvasRef.current.setActiveObject(textObj);
    fabricCanvasRef.current.renderAll();
    
    return textObj;
  }, [template]);

  const addCurvedText = useCallback((text = 'Curved Text', options = {}) => {
    if (!fabricCanvasRef.current) return;
    
    const textObj = new fabric.Text(text, {
      left: template.canvas?.width / 2 || 400,
      top: template.canvas?.height / 2 || 300,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Poppins',
      fontSize: 24,
      fill: '#000000',
      ...options,
    });
    
    textObj.set('id', `curved-${Date.now()}`);
    textObj.set('customType', 'curvedText');
    textObj.set('path', null);
    textObj.set('pathSide', 'left');
    textObj.set('pathAlign', 'curve');
    
    fabricCanvasRef.current.add(textObj);
    fabricCanvasRef.current.setActiveObject(textObj);
    fabricCanvasRef.current.renderAll();
    
    return textObj;
  }, [template]);

  const addLine = useCallback((options = {}) => {
    if (!fabricCanvasRef.current) return;
    
    const line = new fabric.Line([0, 0, 200, 0], {
      left: template.canvas?.width / 2 || 400,
      top: template.canvas?.height / 2 || 300,
      originX: 'center',
      originY: 'center',
      stroke: '#000000',
      strokeWidth: 2,
      ...options,
    });
    
    line.set('id', `line-${Date.now()}`);
    line.set('customType', 'line');
    
    fabricCanvasRef.current.add(line);
    fabricCanvasRef.current.setActiveObject(line);
    fabricCanvasRef.current.renderAll();
    
    return line;
  }, [template]);

  const addArrow = useCallback((options = {}) => {
    if (!fabricCanvasRef.current) return;
    
    const line = new fabric.Line([0, 0, 150, 0], {
      left: template.canvas?.width / 2 || 400,
      top: template.canvas?.height / 2 || 300,
      originX: 'center',
      originY: 'center',
      stroke: '#000000',
      strokeWidth: 2,
      ...options,
    });
    
    line.set('id', `arrow-${Date.now()}`);
    line.set('customType', 'arrow');
    
    const arrowHead = new fabric.Triangle({
      left: template.canvas?.width / 2 + 75 || 475,
      top: template.canvas?.height / 2 || 300,
      originX: 'center',
      originY: 'center',
      width: 15,
      height: 15,
      fill: '#000000',
      angle: 90,
    });
    
    arrowHead.set('id', `arrowhead-${Date.now()}`);
    arrowHead.set('customType', 'arrowHead');
    
    fabricCanvasRef.current.add(line);
    fabricCanvasRef.current.add(arrowHead);
    fabricCanvasRef.current.setActiveObject(line);
    fabricCanvasRef.current.renderAll();
    
    return { line, arrowHead };
  }, [template]);

  const addPolygon = useCallback((sides = 6, options = {}) => {
    if (!fabricCanvasRef.current) return;
    
    const polygon = new fabric.Polygon(
      Array.from({ length: sides }, (_, i) => {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        return {
          x: 50 * Math.cos(angle),
          y: 50 * Math.sin(angle),
        };
      }),
      {
        left: template.canvas?.width / 2 || 400,
        top: template.canvas?.height / 2 || 300,
        originX: 'center',
        originY: 'center',
        fill: '#cccccc',
        ...options,
      }
    );
    
    polygon.set('id', `polygon-${Date.now()}`);
    polygon.set('customType', 'polygon');
    
    fabricCanvasRef.current.add(polygon);
    fabricCanvasRef.current.setActiveObject(polygon);
    fabricCanvasRef.current.renderAll();
    
    return polygon;
  }, [template]);

  const enableDrawingMode = useCallback((color = '#000000', brushSize = 2) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;
    
    canvas.renderAll();
  }, []);

  const disableDrawingMode = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.isDrawingMode = false;
    canvas.renderAll();
  }, []);

  const addImage = useCallback((imageUrl, options = {}) => {
    if (!fabricCanvasRef.current) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const fabricImg = new fabric.Image(img, {
        left: template.canvas?.width / 2 || 400,
        top: template.canvas?.height / 2 || 300,
        originX: 'center',
        originY: 'center',
        ...options,
      });
      
      fabricImg.set('id', `image-${Date.now()}`);
      fabricImg.set('customType', 'image');
      
      fabricCanvasRef.current.add(fabricImg);
      fabricCanvasRef.current.setActiveObject(fabricImg);
      fabricCanvasRef.current.renderAll();
    };
    img.src = imageUrl;
  }, [template]);

  const addShape = useCallback((shapeType = 'rect', options = {}) => {
    if (!fabricCanvasRef.current) return;
    
    let shape;
    const defaults = {
      left: template.canvas?.width / 2 || 400,
      top: template.canvas?.height / 2 || 300,
      originX: 'center',
      originY: 'center',
      fill: '#cccccc',
    };
    
    switch (shapeType) {
      case 'circle':
        shape = new fabric.Circle({ ...defaults, radius: 50, ...options });
        break;
      case 'triangle':
        shape = new fabric.Triangle({ ...defaults, width: 100, height: 100, ...options });
        break;
      case 'rect':
      default:
        shape = new fabric.Rect({ ...defaults, width: 100, height: 100, ...options });
    }
    
    shape.set('id', `${shapeType}-${Date.now()}`);
    shape.set('customType', shapeType);
    
    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.renderAll();
    
    return shape;
  }, [template]);

  const deleteActiveObject = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
      onSelectionChange?.(null);
    }
  }, [onSelectionChange]);

  const duplicateActiveObject = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.clone((cloned) => {
        cloned.set({
          left: activeObject.left + 20,
          top: activeObject.top + 20,
          id: `${activeObject.id}-copy`,
        });
        fabricCanvasRef.current.add(cloned);
        fabricCanvasRef.current.setActiveObject(cloned);
        fabricCanvasRef.current.renderAll();
      });
    }
  }, []);

  const bringForward = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.bringForward(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const sendBackward = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.sendBackwards(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const exportAsPNG = useCallback((multiplier = 2) => {
    if (!fabricCanvasRef.current) return null;
    return fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier,
    });
  }, []);

  const exportAsJPG = useCallback((multiplier = 2) => {
    if (!fabricCanvasRef.current) return null;
    return fabricCanvasRef.current.toDataURL({
      format: 'jpeg',
      quality: 0.9,
      multiplier,
    });
  }, []);

  const exportAsJSON = useCallback(() => {
    if (!fabricCanvasRef.current) return null;
    return JSON.stringify(fabricCanvasRef.current.toJSON(['id', 'customType']));
  }, []);

  const exportAsJSONWithDims = useCallback(() => {
    if (!fabricCanvasRef.current) return null;
    const canvas = fabricCanvasRef.current;
    return JSON.stringify({
      version: "5.3.0",
      objects: canvas.toJSON(['id', 'customType']).objects,
      background: canvas.backgroundColor,
      width: canvas.width,
      height: canvas.height
    });
  }, []);

  const loadFromJSON = useCallback((json) => {
    if (!fabricCanvasRef.current || !json) return Promise.resolve();
    
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    
    if (data.width && data.height) {
      fabricCanvasRef.current.setDimensions({
        width: data.width,
        height: data.height
      });
    }
    
    return fabricCanvasRef.current.loadFromJSON(data).then(() => {
      fabricCanvasRef.current.renderAll();
    });
  }, []);

  const loadFromCanvasJSON = useCallback((canvasData) => {
    if (!fabricCanvasRef.current || !canvasData) return Promise.resolve();
    
    const data = typeof canvasData === 'string' ? JSON.parse(canvasData) : canvasData;
    
    if (data.dimensions) {
      fabricCanvasRef.current.setDimensions({
        width: data.dimensions.width,
        height: data.dimensions.height
      });
    } else if (data.width && data.height) {
      fabricCanvasRef.current.setDimensions({
        width: data.width,
        height: data.height
      });
    }
    
    const jsonToLoad = data.canvasData || data;
    
    return fabricCanvasRef.current.loadFromJSON(jsonToLoad).then(() => {
      if (data.background) {
        fabricCanvasRef.current.backgroundColor = data.background;
      }
      fabricCanvasRef.current.renderAll();
    });
  }, []);

  const getCanvas = useCallback(() => {
    return fabricCanvasRef.current;
  }, []);

  const applyImageFilter = useCallback((filterType, value) => {
    if (!fabricCanvasRef.current || !selectedObject || selectedObject.customType !== 'image') return;
    
    const obj = selectedObject;
    const filter = new fabric.Image.filters[filterType]({ [filterType === 'blur' ? 'blur' : 'value']: value });
    obj.filters.push(filter);
    obj.applyFilters();
    fabricCanvasRef.current.renderAll();
  }, [selectedObject]);

  const setObjectOpacity = useCallback((opacity) => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.set('opacity', opacity);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const setObjectRotation = useCallback((angle) => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.set('angle', angle);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const flipHorizontal = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.set('flipX', !activeObject.flipX);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const flipVertical = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.set('flipY', !activeObject.flipY);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const lockObject = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.set({
        selectable: false,
        evented: false,
      });
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const unlockObject = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.set({
        selectable: true,
        evented: true,
      });
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  const getDimensions = useCallback(() => {
    if (!fabricCanvasRef.current) return { width: 1080, height: 1080 };
    return {
      width: fabricCanvasRef.current.width,
      height: fabricCanvasRef.current.height
    };
  }, []);

  // Expose methods via ref
  useEffect(() => {
    if (onCanvasReady) {
      onCanvasReady({
        addText,
        addCurvedText,
        addImage,
        addShape,
        addLine,
        addArrow,
        addPolygon,
        enableDrawingMode,
        disableDrawingMode,
        deleteActiveObject,
        duplicateActiveObject,
        bringForward,
        sendBackward,
        flipHorizontal,
        flipVertical,
        lockObject,
        unlockObject,
        exportAsPNG,
        exportAsJPG,
        exportAsJSON,
        exportAsJSONWithDims,
        loadFromJSON,
        loadFromCanvasJSON,
        getCanvas,
        getDimensions,
        applyImageFilter,
        setObjectOpacity,
        setObjectRotation,
      });
    }
  }, [addText, addCurvedText, addImage, addShape, addLine, addArrow, addPolygon, enableDrawingMode, disableDrawingMode, deleteActiveObject, duplicateActiveObject, bringForward, sendBackward, flipHorizontal, flipVertical, lockObject, unlockObject, exportAsPNG, exportAsJPG, exportAsJSON, exportAsJSONWithDims, loadFromJSON, loadFromCanvasJSON, getCanvas, getDimensions, applyImageFilter, setObjectOpacity, setObjectRotation, onCanvasReady]);

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center overflow-auto bg-gray-900 p-4"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
    >
      <div className="relative shadow-2xl">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasEditor;