// i18n utility — imports from /locales/ per-language files
import en from '../locales/en.js';
import hi from '../locales/hi.js';
import ta from '../locales/ta.js';
import kn from '../locales/kn.js';
import te from '../locales/te.js';
import ml from '../locales/ml.js';

export const translations = { en, hi, ta, kn, te, ml };

export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

export const getLocalizedText = (obj, lang = 'en') => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};
