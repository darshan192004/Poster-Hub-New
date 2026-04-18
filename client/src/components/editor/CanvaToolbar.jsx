import React from "react";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Trash2, Copy, ArrowUp, ArrowDown, FlipHorizontal, FlipVertical
} from "lucide-react";

const CanvaToolbar = ({ selectedObject, onUpdate, onDelete, onDuplicate, onBringForward, onSendBackward }) => {
  if (!selectedObject) {
    return (
      <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-center px-4">
        <span className="text-sm text-slate-500">Select an object to edit</span>
      </div>
    );
  }

  const customType = selectedObject.customType || selectedObject.type;
  const isText = customType === "text";

  return (
    <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      {/* Left: Object Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDuplicate}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <button
          onClick={onBringForward}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          title="Bring Forward"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          onClick={onSendBackward}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          title="Send Backward"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* Middle: Text Controls */}
      {isText && (
        <div className="flex items-center gap-2">
          <select
            value={selectedObject.fontFamily || "Poppins"}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="px-2 py-1 bg-slate-100 border-0 rounded text-sm text-slate-700"
          >
            <option value="Poppins">Poppins</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Anton">Anton</option>
            <option value="Pacifico">Pacifico</option>
            <option value="Roboto">Roboto</option>
            <option value="Cormorant Garamond">Cormorant Garamond</option>
          </select>

          <input
            type="number"
            value={selectedObject.fontSize || 24}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
            className="w-16 px-2 py-1 bg-slate-100 border-0 rounded text-sm text-slate-700"
            min="8"
            max="200"
          />

          <div className="w-px h-6 bg-slate-200 mx-1" />

          <button
            onClick={() => onUpdate({ fontWeight: selectedObject.fontWeight === "bold" ? "normal" : "bold" })}
            className={`p-2 rounded-lg ${selectedObject.fontWeight === "bold" ? "bg-slate-200" : "hover:bg-slate-100"}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUpdate({ fontStyle: selectedObject.fontStyle === "italic" ? "normal" : "italic" })}
            className={`p-2 rounded-lg ${selectedObject.fontStyle === "italic" ? "bg-slate-200" : "hover:bg-slate-100"}`}
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          <input
            type="color"
            value={selectedObject.fill || "#000000"}
            onChange={(e) => onUpdate({ fill: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer"
            title="Color"
          />
        </div>
      )}

      {/* Right: Opacity & Size */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">Opacity</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={selectedObject.opacity || 1}
          onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
          className="w-20"
        />
        <span className="text-xs text-slate-500 w-8">
          {Math.round((selectedObject.opacity || 1) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default CanvaToolbar;