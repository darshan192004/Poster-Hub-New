import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const LayerPanel = ({ canvas, selectedObject, onSelectionChange }) => {
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (!canvas) {
      setLayers([]);
      return;
    }

    const updateLayers = () => {
      const objects = canvas.getObjects();
      const layerData = objects.map((obj, index) => ({
        id: obj.id || `layer-${index}`,
        type: obj.customType || obj.type,
        visible: obj.visible !== false,
        locked: obj.selectable === false,
        label: obj.text?.substring(0, 20) || obj.customType || obj.type,
      }));
      setLayers(layerData.reverse());
    };

    updateLayers();

    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);

    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
    };
  }, [canvas]);

  const handleSelectLayer = (layerId) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const obj = objects.find(o => o.id === layerId);
    if (obj) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
      onSelectionChange?.(obj);
    }
  };

  const handleToggleVisibility = (layerId) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const obj = objects.find(o => o.id === layerId);
    if (obj) {
      obj.set('visible', !obj.visible);
      canvas.renderAll();
      setLayers(prev => prev.map(l => 
        l.id === layerId ? { ...l, visible: !l.visible } : l
      ));
    }
  };

  const handleDeleteLayer = (layerId) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const obj = objects.find(o => o.id === layerId);
    if (obj) {
      canvas.remove(obj);
      canvas.renderAll();
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'text':
        return 'T';
      case 'image':
        return '🖼';
      case 'rect':
        return '□';
      case 'circle':
        return '○';
      case 'triangle':
        return '△';
      default:
        return '•';
    }
  };

  return (
    <div className="w-48 bg-gray-800 border-l border-gray-700 overflow-y-auto">
      <div className="p-3">
        <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">
          Layers ({layers.length})
        </p>

        {layers.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">
            No layers
          </p>
        ) : (
          <div className="space-y-1">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                onClick={() => handleSelectLayer(layer.id)}
                className={`p-2 rounded cursor-pointer text-xs flex items-center gap-2 transition-all ${
                  selectedObject?.id === layer.id
                    ? 'bg-purple-600/20 border border-purple-500'
                    : 'bg-gray-700/50 border border-transparent hover:border-gray-600'
                } ${!layer.visible ? 'opacity-50' : ''}`}
              >
                <span className="text-lg w-5 text-center">{getTypeIcon(layer.type)}</span>
                <span className="flex-1 truncate text-gray-200">{layer.label}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(layer.id);
                    }}
                    className="text-gray-500 hover:text-white"
                    title={layer.visible ? 'Hide' : 'Show'}
                  >
                    {layer.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLayer(layer.id);
                    }}
                    className="text-gray-500 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LayerPanel;