import React, { useState, useRef } from 'react';
import { 
  Type, 
  Image, 
  Square, 
  Circle as CircleIcon, 
  Triangle, 
  Hexagon,
  Upload, 
  Download, 
  FileJson,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Undo,
  Redo,
  Pencil,
  Lock,
  Unlock,
  FlipHorizontal,
  FlipVertical,
  LineChart,
  MousePointer,
  TypeOutline
} from 'lucide-react';

const Toolbar = ({ 
  onAddText, 
  onAddImage, 
  onAddShape,
  onAddLine,
  onAddArrow,
  onAddPolygon,
  onEnableDrawing,
  onDisableDrawing,
  onDelete, 
  onDuplicate,
  onBringForward,
  onSendBackward,
  onFlipHorizontal,
  onFlipVertical,
  onLockObject,
  onUnlockObject,
  onExportPNG,
  onExportJPG,
  onExportJSON,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  selectedObject,
  isDrawingMode = false
}) => {
  const fileInputRef = useRef(null);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAddImage?.(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toolbarGroups = [
    {
      name: 'Text',
      items: [
        {
          icon: Type,
          label: 'Add Text',
          onClick: () => setShowTextMenu(!showTextMenu),
          hasDropdown: true,
        },
        {
          icon: Image,
          label: 'Add Image',
          onClick: () => fileInputRef.current?.click(),
        },
      ],
    },
    {
      name: 'Shapes',
      items: [
        {
          icon: Square,
          label: 'Shapes',
          onClick: () => setShowShapeMenu(!showShapeMenu),
          hasDropdown: true,
        },
        {
          icon: Pencil,
          label: 'Draw',
          onClick: isDrawingMode ? onDisableDrawing : onEnableDrawing,
          active: isDrawingMode,
        },
      ],
    },
    {
      name: 'Arrange',
      items: [
        {
          icon: Copy,
          label: 'Duplicate',
          onClick: onDuplicate,
          disabled: !selectedObject,
        },
        {
          icon: Trash2,
          label: 'Delete',
          onClick: onDelete,
          disabled: !selectedObject,
        },
        {
          icon: ArrowUp,
          label: 'Bring Forward',
          onClick: onBringForward,
          disabled: !selectedObject,
        },
        {
          icon: ArrowDown,
          label: 'Send Backward',
          onClick: onSendBackward,
          disabled: !selectedObject,
        },
      ],
    },
    {
      name: 'Transform',
      items: [
        {
          icon: FlipHorizontal,
          label: 'Flip H',
          onClick: onFlipHorizontal,
          disabled: !selectedObject,
        },
        {
          icon: FlipVertical,
          label: 'Flip V',
          onClick: onFlipVertical,
          disabled: !selectedObject,
        },
        {
          icon: Lock,
          label: 'Lock',
          onClick: onLockObject,
          disabled: !selectedObject,
        },
        {
          icon: Unlock,
          label: 'Unlock',
          onClick: onUnlockObject,
          disabled: !selectedObject,
        },
      ],
    },
    {
      name: 'Export',
      items: [
        {
          icon: Download,
          label: 'Export PNG',
          onClick: onExportPNG,
        },
        {
          icon: Image,
          label: 'JPG',
          onClick: onExportJPG,
        },
        {
          icon: FileJson,
          label: 'JSON',
          onClick: onExportJSON,
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="flex items-center gap-4">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-700">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Main toolbar groups */}
        {toolbarGroups.map((group, groupIndex) => (
          <div key={group.name} className="flex items-center gap-1">
            {groupIndex > 0 && (
              <div className="w-px h-6 bg-gray-700 mx-2" />
            )}
            {group.items.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                disabled={item.disabled}
                className={`p-2 hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors relative ${
                  item.active || (item.label === 'Draw' && isDrawingMode)
                    ? 'text-purple-400 bg-gray-700'
                    : 'text-gray-400 hover:text-white'
                }`}
                title={item.label}
              >
                <item.icon className="w-4 h-4" />
                {item.hasDropdown && showShapeMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-1 z-50 min-w-[140px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddShape?.('rect');
                        setShowShapeMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Square className="w-3 h-3" /> Rectangle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddShape?.('circle');
                        setShowShapeMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <CircleIcon className="w-3 h-3" /> Circle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddShape?.('triangle');
                        setShowShapeMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Triangle className="w-3 h-3" /> Triangle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddPolygon?.(6);
                        setShowShapeMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Hexagon className="w-3 h-3" /> Hexagon
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddLine?.();
                        setShowShapeMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <LineChart className="w-3 h-3" /> Line
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddArrow?.();
                        setShowShapeMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <MousePointer className="w-3 h-3" /> Arrow
                    </button>
                  </div>
                )}
                {item.hasDropdown && showTextMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-1 z-50 min-w-[140px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddText?.();
                        setShowTextMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Type className="w-3 h-3" /> Plain Text
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddText?.('Heading', { fontSize: 48, fontWeight: 'bold' });
                        setShowTextMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                    >
                      <TypeOutline className="w-3 h-3" /> Heading
                    </button>
                  </div>
                )}
              </button>
            ))}
          </div>
        ))}

        {/* Logo/Title */}
        <div className="ml-auto flex items-center gap-2 text-gray-400">
          <span className="text-xs">Fabric.js Editor</span>
        </div>
      </div>

      {/* Dropdown closes when clicking outside */}
      {(showShapeMenu || showTextMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowShapeMenu(false);
            setShowTextMenu(false);
          }} 
        />
      )}

      {/* Drawing mode indicator */}
      {isDrawingMode && (
        <div className="ml-2 px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded">
          Drawing Mode - Click and drag to draw
        </div>
      )}
    </div>
  );
};

export default Toolbar;