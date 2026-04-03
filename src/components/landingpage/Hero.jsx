import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Languages, ArrowRight } from 'lucide-react';
import { t, getLocalizedText } from '../../utils/i18n';
import { LocationPicker } from '../LocationPicker';
import { businessCategories } from '../../data/mockDatabase';
import heroBG from '../../assets/heroBG.png';

export const Hero = ({
    language,
    formData,
    setFormData,
    isAnalyzing,
    onSubmit,
    showLocationPicker,
    setShowLocationPicker,
    onVoiceClick,
    onLanguageClick
}) => {
    return (
        <section className="relative min-h-[120vh] flex items-center justify-center px-4 text-center">
            {/* Hero Background Image */}
            <div className="absolute inset-0 -top-32 -bottom-32 pointer-events-none overflow-hidden blur-[3px]">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${heroBG})` }}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-navy-900/30 via-navy-900/20 to-transparent" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-5xl"
            >
                {/* Main Headline */}
                <h1 className="brand-title text-7xl sm:text-8xl md:text-9xl text-white mb-8 italic -mt-87.5">
                    LeadFlexUp
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12 font-light"
                >
                    Empower your local business with AI-driven insights, smart lead management, and data-powered growth strategies - all in one platform.
                </motion.p>

                {/* Single Row Form - 4 Columns */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    {!isAnalyzing ? (
                        <form onSubmit={onSubmit} className="relative">
                            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-2">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                    {/* Column 1: Business Name */}
                                    <div className="relative">
                                        <input
                                            required
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            placeholder="Your business name..."
                                            className="w-full px-4 py-4 bg-transparent text-navy-800 placeholder-navy-400 text-sm focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={onVoiceClick}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-navy-100 rounded-lg transition-colors"
                                        >
                                            <Mic className="w-4 h-4 text-navy-500" />
                                        </button>
                                    </div>

                                    {/* Column 2: Phone */}
                                    <div className="relative">
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Phone number..."
                                            className="w-full px-4 py-4 bg-transparent text-navy-800 placeholder-navy-400 text-sm focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={onVoiceClick}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-navy-100 rounded-lg transition-colors"
                                        >
                                            <Mic className="w-4 h-4 text-navy-500" />
                                        </button>
                                    </div>

                                    {/* Column 3: Category */}
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-4 bg-transparent text-navy-800 text-sm focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Select category...</option>
                                        {businessCategories.map(c => (
                                            <option key={c.id} value={c.id}>{c.icon} {getLocalizedText(c.label, language)}</option>
                                        ))}
                                    </select>

                                    {/* Column 4: Location + Language + Submit */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowLocationPicker(!showLocationPicker)}
                                            className="flex-1 px-3 py-4 text-sm text-navy-700 hover:bg-white/40 rounded-xl transition-all text-left"
                                        >
                                            {formData.location?.city || 'Location'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={onLanguageClick}
                                            className="p-3 hover:bg-white/40 rounded-xl transition-all"
                                        >
                                            <Languages className="w-5 h-5 text-navy-700" />
                                        </button>

                                        <button
                                            type="submit"
                                            className="p-3 bg-navy-900 hover:bg-navy-800 rounded-xl transition-all"
                                        >
                                            <ArrowRight className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Location Picker Dropdown */}
                            <AnimatePresence>
                                {showLocationPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full mt-2 left-0 right-0 z-50"
                                    >
                                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4">
                                            <LocationPicker
                                                value={formData.location}
                                                onLocationChange={(loc) => {
                                                    setFormData({ ...formData, location: loc });
                                                    setShowLocationPicker(false);
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    ) : (
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 text-center">
                            <div className="w-16 h-16 border-4 border-navy-200 border-t-navy-700 rounded-full mx-auto mb-4 animate-spin" />
                            <p className="text-lg font-semibold text-navy-800">{t('analyzing', language)}</p>
                            <p className="text-sm text-navy-500 mt-2">{t('lpAnalyzingDesc', language)}</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Decorative Image */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-20 relative z-10"
            >
                {/* You can add a decorative image here */}
            </motion.div>
        </section>
    );
};
