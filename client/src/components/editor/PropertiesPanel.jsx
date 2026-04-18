import React, { useEffect, useState } from 'react';
import { X, Type, AlignLeft, AlignCenter, AlignRight, RotateCw, Sun, Contrast, Droplet, Move, Waves } from 'lucide-react';

const FONTS = [
  { name: 'Poppins', label: 'Poppins' },
  { name: 'Montserrat', label: 'Montserrat' },
  { name: 'Lato', label: 'Lato' },
  { name: 'Playfair Display', label: 'Playfair Display' },
  { name: 'Anton', label: 'Anton' },
  { name: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { name: 'Pacifico', label: 'Pacifico' },
  { name: 'Dancing Script', label: 'Dancing Script' },
  { name: 'Roboto', label: 'Roboto' },
  { name: 'Open Sans', label: 'Open Sans' },
  { name: 'Bebas Neue', label: 'Bebas Neue' },
  { name: 'Oswald', label: 'Oswald' },
];

const PRESET_COLORS = [
  '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#F8B500', '#E74C3C', '#2ECC71',
  '#3498DB', '#9B59B6', '#34495E', '#2C3E50', '#000000',
  '#1A1A2E', '#1E3A8A', '#7C3AED', '#DB2777', '#F97316'
];

const PropertiesPanel = ({ selectedObject, onUpdate, onClose }) => {
  const [properties, setProperties] = useState({
    text: '',
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: 'normal',
    fill: '#000000',
    textAlign: 'left',
    opacity: 1,
    angle: 0,
    stroke: '',
    strokeWidth: 0,
  });

  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    if (!selectedObject) return;

    const props = {
      text: selectedObject.text || '',
      fontFamily: selectedObject.fontFamily || 'Poppins',
      fontSize: selectedObject.fontSize || 24,
      fontWeight: selectedObject.fontWeight || 'normal',
      fill: selectedObject.fill || '#000000',
      textAlign: selectedObject.textAlign || 'left',
      opacity: selectedObject.opacity || 1,
      angle: selectedObject.angle || 0,
      stroke: selectedObject.stroke || '',
      strokeWidth: selectedObject.strokeWidth || 0,
    };

    setProperties(props);
  }, [selectedObject]);

  const handleChange = (key, value) => {
    setProperties(prev => ({ ...prev, [key]: value }));
    onUpdate?.({ [key]: value });
  };

  const objectType = selectedObject?.customType || selectedObject?.type;

  if (!selectedObject) {
    return (
      <div className="w-56 bg-gray-800 border-l border-gray-700 p-4">
        <p className="text-gray-500 text-xs text-center py-8">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-56 bg-gray-800 border-l border-gray-700 overflow-y-auto">
      <div className="p-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs uppercase tracking-wider">
            Properties
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 border-b border-gray-700 pb-2">
          {[
            { id: 'general', label: 'General' },
            objectType === 'image' ? { id: 'effects', label: 'Effects' } : null,
            { id: 'position', label: 'Position' },
          ].filter(Boolean).map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 py-1 text-[10px] rounded ${
                activeSection === section.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Object Type Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded-full capitalize">
            {objectType}
          </span>
        </div>

        {/* Filter Controls for Images */}
        {activeSection === 'effects' && objectType === 'image' && (
          <div className="space-y-3">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Image Effects</p>
            
            <div>
              <label className="text-gray-400 text-[10px] block mb-1 flex items-center gap-1">
                <Sun className="w-3 h-3" /> Brightness
              </label>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                defaultValue={0}
                onChange={(e) => onUpdate?.({ filter: 'brightness', value: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 h-1"
              />
            </div>

            <div>
              <label className="text-gray-400 text-[10px] block mb-1 flex items-center gap-1">
                <Contrast className="w-3 h-3" /> Contrast
              </label>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                defaultValue={0}
                onChange={(e) => onUpdate?.({ filter: 'contrast', value: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 h-1"
              />
            </div>

            <div>
              <label className="text-gray-400 text-[10px] block mb-1 flex items-center gap-1">
                <Droplet className="w-3 h-3" /> Saturation
              </label>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                defaultValue={1}
                onChange={(e) => onUpdate?.({ filter: 'saturation', value: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 h-1"
              />
            </div>

            <div>
              <label className="text-gray-400 text-[10px] block mb-1 flex items-center gap-1">
                <Waves className="w-3 h-3" /> Blur
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                defaultValue={0}
                onChange={(e) => onUpdate?.({ filter: 'blur', value: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 h-1"
              />
            </div>

            <button
              onClick={() => onUpdate?.({ filter: 'remove' })}
              className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
            >
              Remove All Filters
            </button>
          </div>
        )}

        {/* Text Content (only for text objects) */}
        {objectType === 'text' && (
          <div>
            <label className="text-gray-400 text-[10px] uppercase block mb-1">
              Text
            </label>
            <textarea
              value={properties.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-xs resize-none"
              rows={3}
              placeholder="Enter text..."
            />
          </div>
        )}

        {/* Image URL (for image objects) */}
        {objectType === 'image' && (
          <div>
            <label className="text-gray-400 text-[10px] uppercase block mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={selectedObject.src || ''}
              onChange={(e) => onUpdate?.({ src: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              placeholder="Enter image URL..."
            />
          </div>
        )}

        {/* Font Options (only for text objects) */}
        {objectType === 'text' && (
          <>
            <div>
              <label className="text-gray-400 text-[10px] uppercase block mb-1">
                Font
              </label>
              <select
                value={properties.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full p-1.5 bg-gray-700 border border-gray-600 rounded text-white text-xs"
              >
                {FONTS.map((font) => (
                  <option key={font.name} value={font.name} style={{ fontFamily: font.name }}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-[10px] uppercase block mb-1">
                Size: {properties.fontSize}px
              </label>
              <input
                type="range"
                min={8}
                max={120}
                value={properties.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full accent-purple-500 h-1"
              />
            </div>

            <div>
              <label className="text-gray-400 text-[10px] uppercase block mb-1">
                Alignment
              </label>
              <div className="flex gap-1">
                {[
                  { icon: AlignLeft, align: 'left' },
                  { icon: AlignCenter, align: 'center' },
                  { icon: AlignRight, align: 'right' },
                ].map(({ icon: Icon, align }) => (
                  <button
                    key={align}
                    onClick={() => handleChange('textAlign', align)}
                    className={`flex-1 py-1.5 rounded text-xs flex items-center justify-center ${
                      properties.textAlign === align
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <label className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                <input
                  type="checkbox"
                  checked={properties.fontWeight === 'bold'}
                  onChange={(e) => handleChange('fontWeight', e.target.checked ? 'bold' : 'normal')}
                  className="accent-purple-500"
                />
                Bold
              </label>
            </div>
          </>
        )}

        {/* Color */}
        <div>
          <label className="text-gray-400 text-[10px] uppercase block mb-1">
            Color
          </label>
          <div className="flex flex-wrap gap-1">
            {PRESET_COLORS.slice(0, 12).map((color) => (
              <button
                key={color}
                onClick={() => handleChange('fill', color)}
                className={`w-5 h-5 rounded border cursor-pointer ${
                  properties.fill === color
                    ? 'border-white ring-1 ring-purple-400'
                    : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={properties.fill}
            onChange={(e) => handleChange('fill', e.target.value)}
            className="w-full h-6 mt-1 cursor-pointer rounded"
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="text-gray-400 text-[10px] uppercase block mb-1">
            Opacity: {Math.round(properties.opacity * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={properties.opacity}
            onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
            className="w-full accent-purple-500 h-1"
          />
        </div>

        {/* Rotation */}
        {(objectType === 'text' || objectType === 'rect' || objectType === 'circle' || objectType === 'triangle' || objectType === 'image') && (
          <div>
            <label className="text-gray-400 text-[10px] uppercase block mb-1 flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Rotation: {properties.angle}°
            </label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={properties.angle}
              onChange={(e) => {
                setProperties(prev => ({ ...prev, angle: parseInt(e.target.value) }));
                onUpdate?.({ angle: parseInt(e.target.value) });
              }}
              className="w-full accent-purple-500 h-1"
            />
          </div>
        )}

        {/* Stroke */}
        <div>
          <label className="text-gray-400 text-[10px] uppercase block mb-1">
            Stroke Color
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => {
                setProperties(prev => ({ ...prev, stroke: '' }));
                onUpdate?.({ stroke: '' });
              }}
              className={`w-6 h-6 rounded border text-[8px] ${properties.stroke === '' ? 'border-white ring-1 ring-purple-400' : 'border-gray-600'}`}
              title="None"
            >
              -
            </button>
            {PRESET_COLORS.slice(0, 8).map((color) => (
              <button
                key={color}
                onClick={() => {
                  setProperties(prev => ({ ...prev, stroke: color }));
                  onUpdate?.({ stroke: color });
                }}
                className={`w-6 h-6 rounded border ${
                  properties.stroke === color
                    ? 'border-white ring-1 ring-purple-400'
                    : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-[10px] uppercase block mb-1">
            Stroke Width: {properties.strokeWidth}px
          </label>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={properties.strokeWidth}
            onChange={(e) => {
              setProperties(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }));
              onUpdate?.({ strokeWidth: parseInt(e.target.value) });
            }}
            className="w-full accent-purple-500 h-1"
          />
        </div>

        {/* Position (read-only) */}
        {activeSection === 'position' && (
          <div className="space-y-3">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Position & Size</p>
            
            <div>
              <label className="text-gray-400 text-[10px] block mb-1 flex items-center gap-1">
                <Move className="w-3 h-3" /> Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-700 p-1.5 rounded">
                  <span className="text-gray-500 text-[10px]">X:</span>{' '}
                  <span className="text-white text-xs">{Math.round(selectedObject.left || 0)}</span>
                </div>
                <div className="bg-gray-700 p-1.5 rounded">
                  <span className="text-gray-500 text-[10px]">Y:</span>{' '}
                  <span className="text-white text-xs">{Math.round(selectedObject.top || 0)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[10px] block mb-1">Size</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-700 p-1.5 rounded">
                  <span className="text-gray-500 text-[10px]">W:</span>{' '}
                  <span className="text-white text-xs">{Math.round(selectedObject.width || 0)}</span>
                </div>
                <div className="bg-gray-700 p-1.5 rounded">
                  <span className="text-gray-500 text-[10px]">H:</span>{' '}
                  <span className="text-white text-xs">{Math.round(selectedObject.height || 0)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[10px] block mb-1">Scale</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-700 p-1.5 rounded">
                  <span className="text-gray-500 text-[10px]">ScaleX:</span>{' '}
                  <span className="text-white text-xs">{(selectedObject.scaleX || 1).toFixed(2)}</span>
                </div>
                <div className="bg-gray-700 p-1.5 rounded">
                  <span className="text-gray-500 text-[10px]">ScaleY:</span>{' '}
                  <span className="text-white text-xs">{(selectedObject.scaleY || 1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Size (read-only) */}
        {(objectType === 'rect' || objectType === 'circle' || objectType === 'triangle') && (
          <div>
            <label className="text-gray-400 text-[10px] uppercase block mb-1">
              Size
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-700 p-1.5 rounded">
                <span className="text-gray-500">W:</span>{' '}
                <span className="text-white">{Math.round(selectedObject.width || 0)}</span>
              </div>
              <div className="bg-gray-700 p-1.5 rounded">
                <span className="text-gray-500">H:</span>{' '}
                <span className="text-white">{Math.round(selectedObject.height || 0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;