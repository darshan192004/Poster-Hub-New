import React from "react";
import { ZoomIn, ZoomOut, Menu, Check, RotateCw } from "lucide-react";

const CanvaBottomBar = ({ 
  zoom, 
  onZoomChange, 
  dimensions, 
  autoSaved,
  onToggleSidebar,
  showSidebar 
}) => {
  return (
    <div className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-4 shrink-0">
      {/* Left: Toggle Sidebar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            showSidebar ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>Library</span>
        </button>
      </div>

      {/* Center: Page Info */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {dimensions?.width || 1080} × {dimensions?.height || 1080}
        </span>
      </div>

      {/* Right: Zoom & Auto-save */}
      <div className="flex items-center gap-4">
        {/* Auto-save indicator */}
        <div className="flex items-center gap-1.5">
          {autoSaved ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-600">Saved</span>
            </>
          ) : (
            <>
              <RotateCw className="w-3 h-3 text-amber-500 animate-spin" />
              <span className="text-xs text-amber-600">Saving...</span>
            </>
          )}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onZoomChange(Math.max(25, zoom - 10))}
            disabled={zoom <= 25}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-40"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-600 w-12 text-center">{zoom}%</span>
          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            disabled={zoom >= 200}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-40"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Slider */}
        <input
          type="range"
          min="25"
          max="200"
          value={zoom}
          onChange={(e) => onZoomChange(parseInt(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default CanvaBottomBar;