import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Image, Video, Layout, Type, Download, Eye, Filter, Search,
  Grid3X3, Rows3, Heart, Share2, Sparkles, Palette, Plus, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { contentTemplates } from '../data/mockDatabase';

const fade = (i = 0) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } });

const typeIcons = { poster: Image, story: Image, banner: Layout, video: Video, carousel: Grid3X3 };
const typeColors = { poster: 'bg-blue-500', story: 'bg-purple-500', banner: 'bg-orange-500', video: 'bg-red-500', carousel: 'bg-teal-500' };

export const ContentStudio = () => {
  const { language, businessData } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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

  return (
    <div className="space-y-5">
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
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-50 rounded-lg border border-navy-100 w-48">
            <Search className="w-3.5 h-3.5 text-navy-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search templates..."
              className="bg-transparent text-[11px] outline-none w-full text-navy-700 placeholder:text-navy-300" />
          </div>
          {/* Category pills */}
          <div className="flex gap-1.5 flex-1 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize transition-colors ${
                  activeFilter === cat ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-500 hover:bg-navy-100'
                }`}>{cat}</button>
            ))}
          </div>
          {/* View toggle */}
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('bento')} className={`p-1.5 rounded-lg ${viewMode === 'bento' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-400'}`}>
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-navy-700 text-white' : 'bg-navy-50 text-navy-400'}`}>
              <Rows3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {/* Type pills */}
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
                <div className={`group relative rounded-xl overflow-hidden cursor-pointer border border-navy-100 hover:border-teal-300 hover:shadow-lg transition-all`}>
                  <img src={tmpl.thumb} alt={tmpl.name} className={`w-full ${aspectH} object-cover`} />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-4 h-4 rounded flex items-center justify-center ${typeColors[tmpl.type]}`}>
                          <Icon className="w-2.5 h-2.5 text-white" />
                        </span>
                        <span className="text-[10px] font-bold text-white">{tmpl.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 bg-white text-navy-800 text-[9px] font-semibold rounded-md hover:bg-teal-50 flex items-center gap-1">
                          <Palette className="w-2.5 h-2.5" /> Customize
                        </button>
                        <button className="p-1 bg-white/20 rounded-md hover:bg-white/30"><Download className="w-3 h-3 text-white" /></button>
                        <button className="p-1 bg-white/20 rounded-md hover:bg-white/30"><Heart className="w-3 h-3 text-white" /></button>
                      </div>
                    </div>
                  </div>
                  {/* Type badge */}
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
                <button className="px-3 py-1.5 bg-navy-700 text-white text-[10px] font-semibold rounded-lg hover:bg-navy-800">
                  Edit
                </button>
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
                <button className="flex-1 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Customize & Edit
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
