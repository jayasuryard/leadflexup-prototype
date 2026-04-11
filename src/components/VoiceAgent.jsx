import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, MessageCircle } from 'lucide-react';
import { t } from '../utils/i18n';
import { sendGroqMessage } from '../config/groq';

/* ─── BCP-47 maps ─── */
const sttMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN', te: 'te-IN', ml: 'ml-IN' };
const ttsMap = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN', te: 'te-IN', ml: 'ml-IN' };

/* ─── States ─── */
const S = { IDLE: 'idle', LISTENING: 'listening', THINKING: 'thinking', SPEAKING: 'speaking' };

/* ─── Live Waveform — driven by real audio analyser data ─── */
const BAR_COUNT = 32;
const LiveWaveform = ({ analyserRef, active, color = 'red' }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const barW = Math.max(2, (w / BAR_COUNT) - 2);
    const gap = 2;

    const colors = {
      red: ['rgba(239,68,68,0.8)', 'rgba(239,68,68,0.3)'],
      teal: ['rgba(20,184,166,0.8)', 'rgba(20,184,166,0.3)'],
      purple: ['rgba(139,92,246,0.8)', 'rgba(139,92,246,0.3)'],
      gray: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)'],
    };
    const [fill, fillDim] = colors[color] || colors.gray;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);

      const analyser = analyserRef?.current;
      if (!analyser || !active) {
        // Flat line when idle
        for (let i = 0; i < BAR_COUNT; i++) {
          const x = i * (barW + gap) + gap;
          ctx.fillStyle = fillDim;
          ctx.beginPath();
          ctx.roundRect(x, h / 2 - 1, barW, 2, 1);
          ctx.fill();
        }
        return;
      }

      const bufLen = analyser.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyser.getByteFrequencyData(data);

      // Sample evenly from the frequency bins
      for (let i = 0; i < BAR_COUNT; i++) {
        const idx = Math.floor((i / BAR_COUNT) * bufLen);
        const val = data[idx] / 255;
        const barH = Math.max(2, val * h * 0.9);
        const x = i * (barW + gap) + gap;
        const y = (h - barH) / 2;

        ctx.fillStyle = val > 0.1 ? fill : fillDim;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, barW / 2);
        ctx.fill();
      }
    };

    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [analyserRef, active, color]);

  return <canvas ref={canvasRef} width={BAR_COUNT * 4 + 8} height={48} className="h-12" style={{ imageRendering: 'auto' }} />;
};

/* ─── Animated Orb ─── */
const Orb = ({ state, volume }) => {
  const baseSize = state === S.LISTENING ? 180 : state === S.SPEAKING ? 160 : 140;
  // When listening, pulse the orb bigger based on mic volume
  const volumeBoost = state === S.LISTENING ? volume * 30 : 0;
  const effectiveSize = baseSize + volumeBoost;

  const glowColor = state === S.LISTENING ? 'rgba(239, 68, 68, 0.4)' :
                     state === S.SPEAKING ? 'rgba(20, 184, 166, 0.4)' :
                     state === S.THINKING ? 'rgba(139, 92, 246, 0.4)' : 'rgba(100, 116, 139, 0.15)';
  const coreColor = state === S.LISTENING ? 'from-red-500 via-red-400 to-rose-600' :
                    state === S.SPEAKING ? 'from-teal-500 via-emerald-400 to-teal-600' :
                    state === S.THINKING ? 'from-violet-500 via-purple-400 to-indigo-600' :
                    'from-slate-400 via-slate-300 to-slate-500';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      {state !== S.IDLE && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{ background: glowColor, width: effectiveSize + 50, height: effectiveSize + 50, transition: 'width 0.1s, height 0.1s' }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: state === S.THINKING ? 1.5 : 2, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{ background: glowColor, width: effectiveSize + 30, height: effectiveSize + 30, transition: 'width 0.1s, height 0.1s' }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: state === S.THINKING ? 1.2 : 1.8, ease: 'easeInOut', delay: 0.2 }}
          />
        </>
      )}
      <div
        className={`rounded-full bg-gradient-to-br ${coreColor} shadow-2xl`}
        style={{
          width: effectiveSize,
          height: effectiveSize,
          boxShadow: `0 0 60px 20px ${glowColor}`,
          transition: 'width 0.1s ease-out, height 0.1s ease-out',
        }}
      />
      <div className="absolute flex items-center justify-center">
        {state === S.LISTENING && (
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
            <Mic className="w-10 h-10 text-white drop-shadow-lg" />
          </motion.div>
        )}
        {state === S.THINKING && (
          <motion.div className="flex gap-1.5" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="w-2.5 h-2.5 bg-white rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
            ))}
          </motion.div>
        )}
        {state === S.SPEAKING && (
          <div className="flex items-end gap-0.5">
            {[0,1,2,3,4,3,2,1,0].map((h, i) => (
              <motion.div key={i} className="w-1 bg-white rounded-full"
                animate={{ height: [6 + h * 2, 14 + h * 4, 6 + h * 2] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.06 }} />
            ))}
          </div>
        )}
        {state === S.IDLE && <Mic className="w-9 h-9 text-white/80 drop-shadow" />}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   VOICE AGENT — Full-screen ChatGPT-style
   ═══════════════════════════════════════ */
export const VoiceAgent = ({ onClose, language, businessData, analyticsData, mode = 'chat' }) => {
  const [state, setState] = useState(S.LISTENING);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [volume, setVolume] = useState(0);

  const historyRef = useRef([]);
  const stateRef = useRef(S.LISTENING);
  const abortRef = useRef(false);
  const recRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const micStreamRef = useRef(null);
  const volumeRafRef = useRef(null);

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { stateRef.current = state; }, [state]);

  /* ─── setup microphone → Web Audio API analyser ─── */
  const setupMicAnalyser = useCallback(async () => {
    // Reuse if already set up
    if (analyserRef.current && audioCtxRef.current?.state !== 'closed') return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Continuously read volume for the orb
      const readVolume = () => {
        volumeRafRef.current = requestAnimationFrame(readVolume);
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const avg = sum / data.length / 255;
        setVolume(avg);
      };
      readVolume();
    } catch (e) {
      console.warn('Mic access error:', e);
    }
  }, []);

  const cleanupMicAnalyser = useCallback(() => {
    if (volumeRafRef.current) cancelAnimationFrame(volumeRafRef.current);
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current?.state !== 'closed') {
      try { audioCtxRef.current?.close(); } catch {}
    }
    analyserRef.current = null;
    audioCtxRef.current = null;
    micStreamRef.current = null;
    setVolume(0);
  }, []);

  /* ─── ensure TTS voices are ready (Chrome lazy-loads them) ─── */
  const voicesReadyRef = useRef(false);
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis?.getVoices();
      if (v && v.length > 0) voicesReadyRef.current = true;
    };
    loadVoices();
    window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', loadVoices);
  }, []);

  /* ─── speak text via TTS (with Chrome pause workaround) ─── */
  const speakText = useCallback((text) => {
    if (!text || abortRef.current) {
      setState(S.IDLE);
      setTimeout(() => { if (!abortRef.current) doStartListening(); }, 600);
      return;
    }
    window.speechSynthesis.cancel();

    // Small delay to let cancel() flush
    setTimeout(() => {
      if (abortRef.current) return;

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = ttsMap[language] || 'en-IN';
      utter.rate = 1;
      utter.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const target = ttsMap[language] || 'en-IN';
      const langPrefix = target.split('-')[0];
      const match = voices.find(v => v.lang === target)
        || voices.find(v => v.lang.startsWith(langPrefix))
        || voices.find(v => v.default);
      if (match) utter.voice = match;

      utter.onstart = () => setState(S.SPEAKING);
      utter.onend = () => {
        clearInterval(chromeTimer);
        setState(S.IDLE);
        setTimeout(() => { if (!abortRef.current) doStartListening(); }, 500);
      };
      utter.onerror = (e) => {
        clearInterval(chromeTimer);
        console.warn('TTS error:', e.error);
        setState(S.IDLE);
        setTimeout(() => { if (!abortRef.current) doStartListening(); }, 500);
      };

      window.speechSynthesis.speak(utter);
      setState(S.SPEAKING);

      // Chrome bug workaround: Chrome pauses TTS after ~15s. Periodically resume.
      const chromeTimer = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          // Still playing, good
        } else if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          // Not speaking anymore
          clearInterval(chromeTimer);
        }
      }, 5000);
    }, 100);
  }, [language]);

  /* ─── process user message → AI → speak ─── */
  const processMessage = useCallback(async (text) => {
    const userMsg = { role: 'user', text };
    const currentHistory = [...historyRef.current, userMsg];
    setHistory(currentHistory);
    setTranscript('');
    setError('');
    setState(S.THINKING);

    try {
      const result = await sendGroqMessage(currentHistory.slice(-10), mode, businessData, analyticsData, language);
      if (abortRef.current) return;

      if (result.error) {
        setError(result.message);
        setResponse('');
        setState(S.IDLE);
        setTimeout(() => { if (!abortRef.current) doStartListening(); }, 1500);
        return;
      }

      const botMsg = { role: 'bot', text: result.message };
      setHistory(prev => [...prev, botMsg]);
      setResponse(result.message);
      speakText(result.message);
    } catch (err) {
      setError(err.message || 'Error getting response');
      setState(S.IDLE);
      setTimeout(() => { if (!abortRef.current) doStartListening(); }, 1500);
    }
  }, [mode, businessData, analyticsData, language, speakText]);

  /* ─── start listening — fresh SpeechRecognition + mic analyser ─── */
  const doStartListening = useCallback(async () => {
    if (abortRef.current) return;
    try { recRef.current?.abort(); } catch {}

    // Ensure mic analyser is running
    await setupMicAnalyser();

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = sttMap[language] || 'en-IN';
    let gotFinal = false;

    rec.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(final || interim);
      if (final) {
        gotFinal = true;
        processMessage(final);
      }
    };

    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') {
        if (!abortRef.current && stateRef.current !== S.THINKING && stateRef.current !== S.SPEAKING) {
          setTimeout(() => { if (!abortRef.current) doStartListening(); }, 300);
        }
        return;
      }
      setError(e.error);
      setState(S.IDLE);
    };

    rec.onend = () => {
      if (!gotFinal && !abortRef.current && stateRef.current === S.LISTENING) {
        setTimeout(() => { if (!abortRef.current) doStartListening(); }, 200);
      }
    };

    recRef.current = rec;
    setState(S.LISTENING);
    setTranscript('');
    setError('');

    try { rec.start(); } catch (e) {
      console.warn('STT start error:', e);
      setTimeout(() => { try { rec.start(); } catch {} }, 300);
    }
  }, [language, processMessage, setupMicAnalyser]);

  /* ─── stop everything ─── */
  const stopAll = useCallback(() => {
    window.speechSynthesis.cancel();
    try { recRef.current?.abort(); } catch {}
    cleanupMicAnalyser();
    setState(S.IDLE);
    setTranscript('');
  }, [cleanupMicAnalyser]);

  /* ─── handle orb tap ─── */
  const handleOrbTap = useCallback(() => {
    if (stateRef.current === S.LISTENING) {
      try { recRef.current?.abort(); } catch {}
      setState(S.IDLE);
    } else if (stateRef.current === S.SPEAKING) {
      window.speechSynthesis.cancel();
      setTimeout(() => doStartListening(), 200);
    } else if (stateRef.current === S.IDLE) {
      doStartListening();
    }
  }, [doStartListening]);

  /* ─── auto-start on mount ─── */
  useEffect(() => {
    const timer = setTimeout(() => doStartListening(), 150);
    return () => clearTimeout(timer);
  }, []);

  /* ─── cleanup on unmount ─── */
  useEffect(() => {
    return () => {
      abortRef.current = true;
      window.speechSynthesis.cancel();
      try { recRef.current?.abort(); } catch {}
      cleanupMicAnalyser();
    };
  }, [cleanupMicAnalyser]);

  /* ─── status text ─── */
  const statusText = state === S.LISTENING ? t('voiceListening', language)
    : state === S.THINKING ? t('copilotThinking', language)
    : state === S.SPEAKING ? t('voiceSpeaking', language)
    : t('voiceTapToSpeak', language);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{
        background: state === S.LISTENING
          ? 'radial-gradient(ellipse at center, #1a0a0a 0%, #0a0a0a 100%)'
          : state === S.SPEAKING
          ? 'radial-gradient(ellipse at center, #0a1a1a 0%, #0a0a0a 100%)'
          : state === S.THINKING
          ? 'radial-gradient(ellipse at center, #0f0a1e 0%, #0a0a0a 100%)'
          : 'radial-gradient(ellipse at center, #111 0%, #0a0a0a 100%)',
        transition: 'background 0.8s ease',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          </div>
          <div>
            <p className="text-white/90 text-sm font-semibold">LeadFlexUp Voice</p>
            <p className="text-white/40 text-[10px]">{businessData?.businessName || ''}</p>
          </div>
        </div>
        <button onClick={() => { stopAll(); onClose(); }}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <X className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Main area — orb + status */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
        {/* Orb — tappable */}
        <button onClick={handleOrbTap} className="focus:outline-none mb-8 cursor-pointer">
          <Orb state={state} volume={volume} />
        </button>

        {/* Status label */}
        <motion.p
          key={state}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/60 text-sm font-medium tracking-wide mb-4"
        >
          {statusText}
        </motion.p>

        {/* Live transcript (while listening) */}
        <AnimatePresence mode="wait">
          {state === S.LISTENING && transcript && (
            <motion.div
              key="transcript"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md text-center"
            >
              <p className="text-white/90 text-lg font-medium leading-relaxed">{transcript}</p>
            </motion.div>
          )}

          {state === S.SPEAKING && response && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-lg text-center px-4 max-h-[30vh] overflow-y-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              <p className="text-white/70 text-sm leading-relaxed">{response}</p>
            </motion.div>
          )}

          {state === S.THINKING && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-white/40 text-xs">{t('copilotThinking', language)}</p>
            </motion.div>
          )}

          {state === S.IDLE && response && !transcript && (
            <motion.div
              key="last-response"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="max-w-lg text-center px-4 max-h-[20vh] overflow-y-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              <p className="text-white/40 text-xs leading-relaxed">{response}</p>
            </motion.div>
          )}

          {error && (
            <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400/80 text-xs mt-2">{error}</motion.p>
          )}
        </AnimatePresence>

        {/* Live waveform — syncs with your actual voice */}
        <div className="mt-8">
          <LiveWaveform
            analyserRef={analyserRef}
            active={state === S.LISTENING || state === S.SPEAKING}
            color={state === S.LISTENING ? 'red' : state === S.SPEAKING ? 'teal' : state === S.THINKING ? 'purple' : 'gray'} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 pb-6 pt-2 flex items-center justify-center gap-4">
        {/* Back to text chat */}
        <button onClick={() => { stopAll(); onClose(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-full text-white/70 text-xs font-medium transition-colors backdrop-blur-sm">
          <MessageCircle className="w-3.5 h-3.5" />
          {t('doChat', language)}
        </button>

        {/* Big mic toggle */}
        <button onClick={handleOrbTap}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
            state === S.LISTENING
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
              : state === S.SPEAKING
              ? 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30'
              : 'bg-white/20 hover:bg-white/30 shadow-white/10'
          }`}>
          {state === S.LISTENING ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Conversation count indicator */}
      {history.length > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <div className="flex gap-1">
            {history.filter(m => m.role === 'user').slice(-5).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
