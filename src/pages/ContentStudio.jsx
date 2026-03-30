import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, Video, Layout, Type, Download, Eye, Filter, Search,
  Grid3X3, Rows3, Heart, Share2, Sparkles, Palette, Plus, X,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2,
  Layers, Move, ZoomIn, ZoomOut, Copy, Link, Check,
  ChevronDown, Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { contentTemplates } from '../data/mockDatabase';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

const typeIcons = { poster: Image, story: Image, banner: Layout, video: Video, carousel: Grid3X3 };
const typeColors = { poster: 'bg-blue-500', story: 'bg-purple-500', banner: 'bg-orange-500', video: 'bg-red-500', carousel: 'bg-teal-500' };

/* ─── Share Dialog ─── */
const ShareDialog = ({ template, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://leadflexup.app/content/${template.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const channels = [
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500', url: `https://wa.me/?text=${encodeURIComponent(`Check out this design: ${shareUrl}`)}` },
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'Twitter', icon: '🐦', color: 'bg-sky-500', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(template.name)}` },
    { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: 'Email', icon: '📧', color: 'bg-navy-600', url: `mailto:?subject=${encodeURIComponent(template.name)}&body=${encodeURIComponent(shareUrl)}` },
    { name: 'Instagram', icon: '📸', color: 'bg-pink-500', url: '#' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-navy-800">Share Design</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy-50"><X className="w-4 h-4 text-navy-400" /></button>
        </div>
        <div className="flex items-center gap-2 p-2 bg-navy-50 rounded-lg mb-4">
          <Link className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
          <span className="text-[10px] text-navy-500 flex-1 truncate">{shareUrl}</span>
          <button onClick={handleCopy} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-colors ${copied ? 'bg-teal-500 text-white' : 'bg-navy-700 text-white hover:bg-navy-800'}`}>
            {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
        <p className="text-[10px] text-navy-400 font-semibold mb-2">Share to</p>
        <div className="grid grid-cols-3 gap-2">
          {channels.map(ch => (
            <a key={ch.name} href={ch.url} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-navy-50 transition-colors">
              <span className={`w-10 h-10 ${ch.color} rounded-full flex items-center justify-center text-lg`}>{ch.icon}</span>
              <span className="text-[9px] font-medium text-navy-600">{ch.name}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Canvas Editor ─── */
const CanvasEditor = ({ template, onClose }) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(100);
  const [showShare, setShowShare] = useState(false);
  const [layers, setLayers] = useState([
    { id: 1, type: 'image', name: 'Background', visible: true, locked: false },
    { id: 2, type: 'text', name: 'Headline', visible: true, locked: false, content: template.name, x: 50, y: 40, fontSize: 28, fontWeight: 'bold', color: '#ffffff', align: 'center' },
    { id: 3, type: 'text', name: 'Subtext', visible: true, locked: false, content: 'Your tagline here', x: 50, y: 55, fontSize: 14, fontWeight: 'normal', color: '#ffffff', align: 'center' },
    { id: 4, type: 'shape', name: 'CTA Button', visible: true, locked: false, x: 50, y: 72, width: 160, height: 40, color: template.colors?.[0] || '#14b8a6', radius: 20 },
    { id: 5, type: 'text', name: 'CTA Text', visible: true, locked: false, content: 'Learn More →', x: 50, y: 72, fontSize: 13, fontWeight: 'bold', color: '#ffffff', align: 'center' },
  ]);
  const [selectedLayer, setSelectedLayer] = useState(2);
  const [activePanel, setActivePanel] = useState('layers');

  const selectedObj = layers.find(l => l.id === selectedLayer);

  const updateLayer = (id, updates) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const addTextLayer = () => {
    const newId = Math.max(...layers.map(l => l.id)) + 1;
    setLayers(prev => [...prev, {
      id: newId, type: 'text', name: `Text ${newId}`, visible: true, locked: false,
      content: 'New Text', x: 50, y: 50, fontSize: 18, fontWeight: 'normal', color: '#ffffff', align: 'center'
    }]);
    setSelectedLayer(newId);
  };

  const deleteLayer = (id) => {
    if (id === 1) return; // can't delete background
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayer === id) setSelectedLayer(1);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-navy-950 flex flex-col">
      <AnimatePresence>{showShare && <ShareDialog template={template} onClose={() => setShowShare(false)} />}</AnimatePresence>

      {/* Top Toolbar */}
      <div className="h-12 bg-navy-900 border-b border-navy-700 flex items-center px-4 gap-3 flex-shrink-0">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-700 text-navy-300 hover:text-white">
          <X className="w-4 h-4" />
        </button>
        <div className="h-5 w-px bg-navy-700" />
        <span className="text-[11px] font-bold text-white">{template.name}</span>
        <span className="text-[9px] text-navy-400 font-mono">{template.aspect}</span>
        <div className="flex-1" />
        {/* Zoom */}
        <div className="flex items-center gap-1.5 bg-navy-800 rounded-lg px-2 py-1">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="text-navy-300 hover:text-white"><ZoomOut className="w-3.5 h-3.5" /></button>
          <span className="text-[10px] text-navy-300 w-8 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="text-navy-300 hover:text-white"><ZoomIn className="w-3.5 h-3.5" /></button>
        </div>
        <div className="h-5 w-px bg-navy-700" />
        <button onClick={() => setShowShare(true)} className="px-3 py-1.5 bg-navy-700 text-white text-[10px] font-semibold rounded-lg hover:bg-navy-600 flex items-center gap-1.5">
          <Share2 className="w-3 h-3" /> Share
        </button>
        <button className="px-3 py-1.5 bg-navy-700 text-white text-[10px] font-semibold rounded-lg hover:bg-navy-600 flex items-center gap-1.5">
          <Download className="w-3 h-3" /> Export
        </button>
        <button className="px-3 py-1.5 bg-teal-600 text-white text-[10px] font-semibold rounded-lg hover:bg-teal-700 flex items-center gap-1.5">
          <Check className="w-3 h-3" /> Save
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Layer & Properties Panel */}
        <div className="w-56 bg-navy-900 border-r border-navy-700 flex flex-col flex-shrink-0">
          <div className="flex">
            {['layers', 'properties'].map(tab => (
              <button key={tab} onClick={() => setActivePanel(tab)}
                className={`flex-1 py-2.5 text-[10px] font-semibold capitalize border-b-2 transition-colors ${
                  activePanel === tab ? 'text-teal-400 border-teal-400 bg-navy-800/50' : 'text-navy-400 border-transparent hover:text-navy-300'
                }`}>{tab}</button>
            ))}
          </div>

          {activePanel === 'layers' ? (
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {[...layers].reverse().map(layer => (
                <div key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                    selectedLayer === layer.id ? 'bg-teal-500/10 border border-teal-500/30' : 'hover:bg-navy-800'
                  }`}>
                  <span className="text-[10px]">
                    {layer.type === 'image' ? '🖼' : layer.type === 'text' ? '📝' : '◼️'}
                  </span>
                  <span className={`text-[10px] flex-1 ${selectedLayer === layer.id ? 'text-teal-400 font-semibold' : 'text-navy-300'}`}>{layer.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                    className={`${layer.visible ? 'text-navy-400' : 'text-navy-600'}`}>
                    <Eye className="w-3 h-3" />
                  </button>
                  {layer.id !== 1 && (
                    <button onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }} className="text-navy-500 hover:text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addTextLayer}
                className="w-full mt-2 py-2 border border-dashed border-navy-600 rounded-lg text-[10px] text-navy-400 hover:text-teal-400 hover:border-teal-500 transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Add Text Layer
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {selectedObj && selectedObj.type === 'text' && (
                <>
                  <div>
                    <label className="text-[9px] text-navy-400 font-semibold mb-1 block">Text Content</label>
                    <textarea value={selectedObj.content} onChange={e => updateLayer(selectedObj.id, { content: e.target.value })}
                      className="w-full bg-navy-800 border border-navy-600 rounded-lg p-2 text-[11px] text-white resize-none h-16 focus:border-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] text-navy-400 font-semibold mb-1 block">Font Size</label>
                    <input type="range" min="8" max="72" value={selectedObj.fontSize}
                      onChange={e => updateLayer(selectedObj.id, { fontSize: parseInt(e.target.value) })}
                      className="w-full accent-teal-500" />
                    <span className="text-[10px] text-navy-400">{selectedObj.fontSize}px</span>
                  </div>
                  <div>
                    <label className="text-[9px] text-navy-400 font-semibold mb-1 block">Style</label>
                    <div className="flex gap-1.5">
                      <button onClick={() => updateLayer(selectedObj.id, { fontWeight: selectedObj.fontWeight === 'bold' ? 'normal' : 'bold' })}
                        className={`p-1.5 rounded-lg ${selectedObj.fontWeight === 'bold' ? 'bg-teal-500 text-white' : 'bg-navy-800 text-navy-300'}`}>
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      {['left', 'center', 'right'].map(align => (
                        <button key={align} onClick={() => updateLayer(selectedObj.id, { align })}
                          className={`p-1.5 rounded-lg ${selectedObj.align === align ? 'bg-teal-500 text-white' : 'bg-navy-800 text-navy-300'}`}>
                          {align === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> : align === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-navy-400 font-semibold mb-1 block">Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={selectedObj.color} onChange={e => updateLayer(selectedObj.id, { color: e.target.value })}
                        className="w-8 h-8 rounded-lg border-2 border-navy-600 cursor-pointer" />
                      <div className="flex gap-1">
                        {['#ffffff', '#000000', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
                          <button key={c} onClick={() => updateLayer(selectedObj.id, { color: c })}
                            className="w-6 h-6 rounded-full border-2 border-navy-600 hover:border-teal-400 transition-colors"
                            style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] text-navy-400 font-semibold mb-1 block">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-navy-800 rounded-lg p-2">
                        <span className="text-[8px] text-navy-500">X</span>
                        <input type="number" value={selectedObj.x} onChange={e => updateLayer(selectedObj.id, { x: parseInt(e.target.value) })}
                          className="w-full bg-transparent text-[11px] text-white outline-none" />
                      </div>
                      <div className="bg-navy-800 rounded-lg p-2">
                        <span className="text-[8px] text-navy-500">Y</span>
                        <input type="number" value={selectedObj.y} onChange={e => updateLayer(selectedObj.id, { y: parseInt(e.target.value) })}
                          className="w-full bg-transparent text-[11px] text-white outline-none" />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {selectedObj && selectedObj.type === 'shape' && (
                <>
                  <div>
                    <label className="text-[9px] text-navy-400 font-semibold mb-1 block">Fill Color</label>
                    <input type="color" value={selectedObj.color} onChange={e => updateLayer(selectedObj.id, { color: e.target.value })}
                      className="w-8 h-8 rounded-lg border-2 border-navy-600 cursor-pointer" />
                  </div>
                  <div>
                    <label className="text-[9px] text-navy-400 font-semibold mb-1 block">Corner Radius</label>
                    <input type="range" min="0" max="40" value={selectedObj.radius || 0}
                      onChange={e => updateLayer(selectedObj.id, { radius: parseInt(e.target.value) })}
                      className="w-full accent-teal-500" />
                  </div>
                </>
              )}
              {selectedObj && selectedObj.type === 'image' && (
                <p className="text-[10px] text-navy-400 italic">Background layer — drag to reposition</p>
              )}
            </div>
          )}
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 bg-navy-950 flex items-center justify-center overflow-hidden p-8" style={{ backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div ref={canvasRef} className="relative bg-navy-800 rounded-lg overflow-hidden shadow-2xl" style={{
            width: template.aspect === '9:16' ? 270 * (zoom / 100) : template.aspect === '16:9' ? 480 * (zoom / 100) : 360 * (zoom / 100),
            height: template.aspect === '9:16' ? 480 * (zoom / 100) : template.aspect === '16:9' ? 270 * (zoom / 100) : template.aspect === '4:5' ? 450 * (zoom / 100) : 360 * (zoom / 100),
          }}>
            {/* Background image */}
            <img src={template.thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy-900/30" />

            {/* Render layers */}
            {layers.filter(l => l.visible && l.type !== 'image').map(layer => {
              if (layer.type === 'shape') {
                return (
                  <div key={layer.id} onClick={() => setSelectedLayer(layer.id)}
                    className={`absolute cursor-pointer transition-all ${selectedLayer === layer.id ? 'ring-2 ring-teal-400 ring-offset-1' : ''}`}
                    style={{
                      left: `${layer.x - 12}%`, top: `${layer.y - 4}%`,
                      width: layer.width * (zoom / 100), height: layer.height * (zoom / 100),
                      backgroundColor: layer.color, borderRadius: layer.radius,
                    }}
                  />
                );
              }
              if (layer.type === 'text') {
                return (
                  <div key={layer.id} onClick={() => setSelectedLayer(layer.id)}
                    className={`absolute cursor-pointer transition-all px-2 ${selectedLayer === layer.id ? 'ring-2 ring-teal-400 ring-offset-1 ring-offset-transparent' : ''}`}
                    style={{
                      left: layer.align === 'center' ? '50%' : layer.align === 'right' ? 'auto' : `${layer.x - 30}%`,
                      right: layer.align === 'right' ? '5%' : 'auto',
                      top: `${layer.y}%`,
                      transform: layer.align === 'center' ? 'translateX(-50%)' : 'none',
                      fontSize: layer.fontSize * (zoom / 100), fontWeight: layer.fontWeight, color: layer.color,
                      textAlign: layer.align, whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}>
                    {layer.content}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Right: Color Palette & Quick Actions */}
        <div className="w-48 bg-navy-900 border-l border-navy-700 flex flex-col flex-shrink-0 p-3 space-y-4">
          <div>
            <p className="text-[9px] text-navy-400 font-semibold uppercase tracking-wider mb-2">Template Colors</p>
            <div className="grid grid-cols-4 gap-1.5">
              {(template.colors || []).map((c, j) => (
                <button key={j} className="w-full aspect-square rounded-lg border-2 border-navy-700 hover:border-teal-400 transition-colors" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] text-navy-400 font-semibold uppercase tracking-wider mb-2">Quick Actions</p>
            <div className="space-y-1.5">
              {[
                { icon: Sparkles, label: 'AI Generate Copy', color: 'text-purple-400' },
                { icon: Image, label: 'Replace Image', color: 'text-blue-400' },
                { icon: Layers, label: 'Duplicate Template', color: 'text-teal-400' },
                { icon: Palette, label: 'Change Theme', color: 'text-orange-400' },
              ].map(({ icon: Ic, label, color }) => (
                <button key={label} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-navy-800 transition-colors">
                  <Ic className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-[10px] text-navy-300">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] text-navy-400 font-semibold uppercase tracking-wider mb-2">Tags</p>
            <div className="flex flex-wrap gap-1">
              {(template.tags || []).map((tag, j) => (
                <span key={j} className="text-[8px] bg-navy-800 text-navy-300 px-1.5 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ContentStudio = () => {
  const { language, businessData } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [sharingTemplate, setSharingTemplate] = useState(null);
  const [viewMode, setViewMode] = useState('bento');

  const categories = ['all', 'promotion', 'social', 'product', 'restaurant', 'education', 'business'];
  const types = ['all', 'poster', 'story', 'banner', 'video', 'carousel'];
  const [activeType, setActiveType] = useState('all');

  const filtered = contentTemplates.filter(ct => {
    if (activeFilter !== 'all' && ct.category !== activeFilter) return false;
    if (activeType !== 'all' && ct.type !== activeType) return false;
    if (searchQuery && !ct.name.toLowerCase().includes(searchQuery.toLowerCase()) && !ct.tags.some(tag => tag.includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  // If canvas editor is open, render it fullscreen
  if (editingTemplate) {
    return <CanvasEditor template={editingTemplate} onClose={() => setEditingTemplate(null)} />;
  }

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {sharingTemplate && <ShareDialog template={sharingTemplate} onClose={() => setSharingTemplate(null)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900">{t('contentStudio', language)}</h1>
          <p className="text-sm text-navy-400 mt-0.5">{t('contentStudioDesc', language)}</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Create New
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-navy-100 p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-50 rounded-lg border border-navy-100 w-48">
            <Search className="w-3.5 h-3.5 text-navy-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search templates..."
              className="bg-transparent text-[11px] outline-none w-full text-navy-700 placeholder:text-navy-300" />
          </div>
          <div className="flex gap-1.5 flex-1 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize transition-colors ${
                  activeFilter === cat ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'
                }`}>{cat}</button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('bento')} className={`p-1.5 rounded-lg ${viewMode === 'bento' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-400'}`}>
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-400'}`}>
              <Rows3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex gap-1.5 mt-2.5">
          {types.map(tp => {
            const Icon = typeIcons[tp] || Filter;
            return (
              <button key={tp} onClick={() => setActiveType(tp)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-semibold capitalize transition-colors ${
                  activeType === tp ? 'bg-teal-600 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'
                }`}>
                {tp !== 'all' && <Icon className="w-2.5 h-2.5" />}
                {tp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid / List */}
      {viewMode === 'bento' ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((tmpl, i) => {
            const Icon = typeIcons[tmpl.type] || Image;
            const aspectH = tmpl.aspect === '9:16' ? 'h-72' : tmpl.aspect === '16:9' ? 'h-40' : tmpl.aspect === '4:5' ? 'h-64' : 'h-52';
            return (
              <motion.div key={tmpl.id} {...fade(i % 8)} className="break-inside-avoid"
                onClick={() => setSelectedTemplate(tmpl)}>
                <div className="group relative rounded-xl overflow-hidden cursor-pointer border border-navy-100 hover:border-teal-300 hover:shadow-lg transition-all">
                  <img src={tmpl.thumb} alt={tmpl.name} className={`w-full ${aspectH} object-cover`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-4 h-4 rounded flex items-center justify-center ${typeColors[tmpl.type]}`}>
                          <Icon className="w-2.5 h-2.5 text-white" />
                        </span>
                        <span className="text-[10px] font-bold text-white">{tmpl.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={e => { e.stopPropagation(); setEditingTemplate(tmpl); }}
                          className="px-2 py-1 bg-white text-navy-800 text-[9px] font-semibold rounded-md hover:bg-teal-50 flex items-center gap-1">
                          <Palette className="w-2.5 h-2.5" /> Edit
                        </button>
                        <button onClick={e => { e.stopPropagation(); setSharingTemplate(tmpl); }} className="p-1 bg-white/20 rounded-md hover:bg-white/30"><Share2 className="w-3 h-3 text-white" /></button>
                        <button className="p-1 bg-white/20 rounded-md hover:bg-white/30"><Download className="w-3 h-3 text-white" /></button>
                        <button className="p-1 bg-white/20 rounded-md hover:bg-white/30"><Heart className="w-3 h-3 text-white" /></button>
                      </div>
                    </div>
                  </div>
                  <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white capitalize ${typeColors[tmpl.type]}`}>
                    {tmpl.type}
                  </span>
                  {tmpl.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Video className="w-4 h-4 text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((tmpl, i) => {
            const Icon = typeIcons[tmpl.type] || Image;
            return (
              <motion.div key={tmpl.id} {...fade(i % 8)}
                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-navy-100 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => setSelectedTemplate(tmpl)}>
                <img src={tmpl.thumb} alt={tmpl.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded flex items-center justify-center ${typeColors[tmpl.type]}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </span>
                    <h4 className="text-[12px] font-bold text-navy-800">{tmpl.name}</h4>
                    <span className="text-[9px] bg-navy-50 text-navy-500 px-1.5 py-0.5 rounded capitalize">{tmpl.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {tmpl.tags.map((tag, j) => (
                      <span key={j} className="text-[8px] bg-navy-50 text-navy-400 px-1 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {tmpl.colors.map((c, j) => <div key={j} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }} />)}
                </div>
                <span className="text-[10px] font-mono text-navy-400">{tmpl.aspect}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={e => { e.stopPropagation(); setSharingTemplate(tmpl); }}
                    className="p-1.5 rounded-lg bg-navy-50 text-navy-400 hover:text-teal-600 hover:bg-teal-50">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setEditingTemplate(tmpl); }}
                    className="px-3 py-1.5 bg-navy-700 text-white text-[10px] font-semibold rounded-lg hover:bg-navy-800">
                    Edit
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Image className="w-10 h-10 text-navy-200 mx-auto mb-3" />
          <p className="text-sm text-navy-400">No templates matching your filters</p>
        </div>
      )}

      {/* Template Quick Preview Modal */}
      {selectedTemplate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedTemplate(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="bg-white rounded-2xl overflow-hidden max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedTemplate.thumb} alt="" className="w-full h-64 object-cover" />
              <button onClick={() => setSelectedTemplate(null)}
                className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white">
                <X className="w-4 h-4 text-navy-700" />
              </button>
              <span className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[9px] font-bold text-white capitalize ${typeColors[selectedTemplate.type]}`}>
                {selectedTemplate.type}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-navy-800">{selectedTemplate.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-navy-50 text-navy-500 px-2 py-0.5 rounded capitalize">{selectedTemplate.category}</span>
                <span className="text-[10px] text-navy-400 font-mono">{selectedTemplate.aspect}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                {selectedTemplate.colors.map((c, j) => <div key={j} className="w-8 h-8 rounded-lg border-2 border-white shadow-md" style={{ backgroundColor: c }} />)}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedTemplate.tags.map((tag, j) => (
                  <span key={j} className="text-[9px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">#{tag}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => { setSelectedTemplate(null); setEditingTemplate(selectedTemplate); }}
                  className="flex-1 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Open in Editor
                </button>
                <button onClick={() => setSharingTemplate(selectedTemplate)}
                  className="px-4 py-2.5 bg-navy-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button className="px-4 py-2.5 bg-navy-50 text-navy-700 text-xs font-semibold rounded-lg hover:bg-navy-100 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
