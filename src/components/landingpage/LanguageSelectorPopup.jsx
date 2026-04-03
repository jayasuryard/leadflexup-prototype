import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Check } from 'lucide-react';

export const LanguageSelectorPopup = ({ open, onClose, onSelect, currentLanguage, position }) => {
  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
  ];

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100]" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-navy-200/50 p-2 min-w-[220px]"
          style={{ 
            left: `${position?.x}px`, 
            top: `${position?.y}px`,
            transform: 'translateY(0)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-navy-200/30 mb-1">
            <Languages className="w-4 h-4 text-navy-500" />
            <span className="text-xs font-semibold text-navy-700">Select Language</span>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onSelect(lang.code);
                onClose();
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                currentLanguage === lang.code
                  ? 'bg-navy-700 text-white font-medium'
                  : 'text-navy-700 hover:bg-navy-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{lang.native}</span>
                {currentLanguage === lang.code && <Check className="w-4 h-4" />}
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
