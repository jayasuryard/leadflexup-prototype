import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, KeyRound, ArrowRight } from 'lucide-react';

export const LoginModal = ({ open, onClose, onLogin }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setOtpSent(true);
    setError('');
    alert(`Your OTP is: ${code}\n(This is a demo simulation)`);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsVerifying(false);
    onLogin({ phone });
    handleClose();
  };

  const handleClose = () => {
    setPhone('');
    setOtp('');
    setOtpSent(false);
    setGeneratedOtp('');
    setError('');
    setIsVerifying(false);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-navy-900">Login</h2>
            <button onClick={handleClose} className="p-1.5 hover:bg-navy-50 rounded-lg">
              <X className="w-4 h-4 text-navy-400" />
            </button>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={phone.length < 10}
                  className={`px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    phone.length >= 10
                      ? 'bg-navy-700 text-white hover:bg-navy-800'
                      : 'bg-navy-100 text-navy-400 cursor-not-allowed'
                  }`}
                >
                  {otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>

            {/* OTP */}
            {otpSent && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-xs font-semibold text-navy-700 mb-1.5">Enter OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                  <input
                    required
                    value={otp}
                    onChange={e => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setError('');
                    }}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-50 border border-navy-100 rounded-lg text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                <p className="text-[11px] text-teal-600 mt-1">OTP sent to your phone (check the alert)</p>
              </motion.div>
            )}

            {otpSent && (
              <button
                type="submit"
                disabled={isVerifying || otp.length < 6}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  isVerifying || otp.length < 6
                    ? 'bg-navy-200 text-navy-400 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {isVerifying ? (
                  <>
                    <span className="login-spinner" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-navy-200" />
            <span className="text-xs text-navy-400">or</span>
            <div className="flex-1 h-px bg-navy-200" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => {
              onLogin({ provider: 'google', email: 'demo@gmail.com' });
              handleClose();
            }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white border border-navy-200 rounded-lg text-sm font-semibold text-navy-700 hover:bg-navy-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="text-[11px] text-navy-400 text-center mt-4">
            Don't have an account? Subscribe to get started.
          </p>

          <style>{`
            .login-spinner {
              width: 14px;
              height: 14px;
              border: 2px solid rgba(255,255,255,0.3);
              border-top-color: white;
              border-radius: 50%;
              animation: lspin 0.6s linear infinite;
            }
            @keyframes lspin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
