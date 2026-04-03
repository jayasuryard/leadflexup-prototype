import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

export const VoiceInputModal = ({ open, onClose, onTranscript, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript) {
        onTranscript(transcript);
        onClose();
      }
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative inline-flex items-center justify-center mb-6">
            <motion.div
              animate={isListening ? {
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute w-32 h-32 bg-teal-500/20 rounded-full"
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-navy-800 mb-2">
            {isListening ? 'Listening...' : 'Speak your business details'}
          </h3>
          <p className="text-sm text-navy-500 mb-4">
            {isListening ? 'Tap the button when done' : 'Tap the microphone to start'}
          </p>

          {transcript && (
            <div className="bg-navy-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-navy-700">{transcript}</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="text-sm text-navy-500 hover:text-navy-700 font-medium"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
